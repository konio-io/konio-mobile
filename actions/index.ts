import { Signer, utils } from "koilib";
import { TransactionJsonWait } from "koilib/lib/interface";
import { ManaStore, UserStore, EncryptedStore, LockStore, WCStore, KapStore } from "../stores";
import { Contact, Coin, Network, Transaction, Account, NFT } from "../types/store";
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS, WC_METHODS } from "../lib/Constants";
import HDKoinos from "../lib/HDKoinos";
import Toast from 'react-native-toast-message';
import { State, none } from "@hookstate/core";
import { getContract, getProvider, getSigner, signMessage, prepareTransaction, sendTransaction, signAndSendTransaction, signHash, signTransaction, waitForTransaction, getKapProfileByAddress, getKapAddressByName, isMainnet, getSeedAddress, convertIpfsToHttps, getContractInfo, getCoinPrice, getCoinBalance, getCoinContract } from "../lib/utils";
import migrations from "../stores/migrations";
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { initWCWallet } from "../lib/WalletConnect";
import { Assets } from "../types/store";

export const setCurrentAccount = (address: string) => {
    UserStore.currentAddress.set(address);
    refreshCoins({balance: true, price: true});
}

export const setCurrentNetwork = (networkId: string) => {
    UserStore.currentNetworkId.set(networkId);
    refreshCoins({balance: true, price: true, info: true, contract: true});
}

export const refreshMana = async () => {
    console.log('refresh mana');
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const provider = getProvider(networkId);
    const manaBalance = await provider.getAccountRc(address);
    const contractId = UserStore.networks[networkId].koinContractId.get();

    ManaStore.merge({
        koin: UserStore.accounts[address].assets[networkId].coins[contractId].balance.get() ?? 0,
        mana: Number(manaBalance) / 1e8
    });
}

export const withdrawCoin = async (args: { contractId: string, to: string, value: string, note: string }) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const { contractId, to, value, note } = args;
    const networkId = UserStore.currentNetworkId.get();

    const coin = UserStore.accounts[address].assets[networkId].coins[contractId];
    const rcLimit = UserStore.rcLimit.get();

    const contract = await getContract({
        address,
        networkId,
        contractId
    });

    if (!contract.abi) {
        throw new Error("Contract abi not found");
    }

    // optional: preformat input/output
    //contract.abi.methods.balance_of.preformat_argument = (owner) => ({  owner,});
    contract.abi.methods.balance_of.preformat_return = (res: any) => utils.formatUnits(res.value, coin.decimal.get());
    contract.abi.methods.transfer.preformat_argument = (input: any) => {
        return {
            from: address,
            to: input.to,
            value: utils.parseUnits(input.value, coin.decimal.get()),
        };
    }

    const { transaction, receipt } = await contract.functions.transfer({
        to,
        value,
    }, {
        rcLimit: (parseInt(rcLimit) * Math.pow(10, 6)).toString()
    });

    if (!transaction || !transaction.id) {
        throw new Error("Error during transaction, not return transaction or its id");
    }

    if (receipt && receipt.logs) {
        throw new Error(`Transfer failed. Logs: ${receipt.logs.join(",")}`);
    }

    const tsx: Transaction = {
        transactionId: transaction.id,
        contractId,
        from: address,
        to,
        value,
        timestamp: new Date().toISOString(),
        status: TRANSACTION_STATUS_PENDING,
        note
    };

    coin.transactions.merge({ [tsx.transactionId]: tsx });
    return transaction;
}


export const addCoin = async (contractId: string) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();

    const contract = await getCoinContract({
        address,
        networkId,
        contractId
    });

    const coin : Coin = {
        decimal: contract.decimal ?? 0,
        symbol: contract.symbol,
        contractId,
        transactions: {}
    };

    UserStore.accounts[address].assets[networkId].coins.merge({
        [contractId]: coin
    });

    refreshCoin({
        contractId,
        balance: true,
        info: true,
        price: true
    });
    
    return coin;
}

const addAddress = async (address: string, name: string) => {
    const assets : Record<string,Assets> = {};
    const networks = Object.values(UserStore.networks.get());
    for (const network of networks) {
        if (!Object.keys(assets).includes(network.chainId)) {
            assets[network.chainId] = {
                coins: {},
                nfts: {}
            };
        }

        const contractId = network.koinContractId;
        const coin : Coin = {
            contractId,
            decimal: 8,
            symbol: 'KOIN',
            transactions: {}
        }
        
        try {
            const info = await getContractInfo(contractId);
            coin.name = info.name;
            coin.logo = info.logo;
        } catch (e) {}

        assets[network.chainId].coins[contractId] = coin;
    }

    const accounts = UserStore.accounts;
    const account: Account = {
        name,
        address,
        assets
    };
    accounts.merge({ [account.address]: account });
}

export const addSeed = async (args: {
    seed: string,
    name: string
}) => {
    const secureAccounts = EncryptedStore.accounts;
    const { seed, name } = args;
    const { address, privateKey } = await HDKoinos.createWallet(seed, 0);

    await addAddress(address, name);

    secureAccounts.merge({
        [address]: {
            address,
            privateKey,
            seed,
            accountIndex: 0
        }
    });

    return address;
}

export const importAccount = async (args: {
    privateKey: string,
    name: string
}) => {
    const secureAccounts = EncryptedStore.accounts;
    const { privateKey, name } = args;
    const signer = Signer.fromWif(privateKey);
    const address = signer.getAddress();

    await addAddress(address, name);

    secureAccounts.merge({
        [address]: {
            address,
            privateKey,
            accountIndex: 0
        }
    });

    return address;
}

export const addAccount = async (name: string) => {
    const secureAccounts = EncryptedStore.accounts;
    const account = Object.values(secureAccounts.get()).find(w => w.seed !== undefined);

    if (!account) {
        throw new Error("Unable to find main seed account");
    }

    if (account.seed === undefined) {
        throw new Error("Provided account address is not a seed account");
    }

    if (account.accountIndex === undefined) {
        throw new Error("Provided account address does not have an accountIndex");
    }

    const { address, privateKey } = await HDKoinos.createWallet(account.seed, account.accountIndex + 1);

    await addAddress(address, name);

    secureAccounts.merge({
        [address]: {
            address,
            privateKey
        }
    });

    secureAccounts[account.address].accountIndex.set(account.accountIndex + 1);
    return address;
}

export const deleteAccount = (address: string) => {
    const seedAddress = getSeedAddress();
    if (!seedAddress) {
        throw new Error("Unable to retrieve seed account");
    }

    if (seedAddress === address) {
        throw new Error("Cannot delete seed account");
    }

    const encryptedAccounts = EncryptedStore.accounts;
    const seedAccount = encryptedAccounts.nested(seedAddress);
    const currentAddress = UserStore.currentAddress;
    const encryptedAccount = encryptedAccounts.nested(address);
    const userAccount = UserStore.accounts.nested(address);

    if (encryptedAccount.accountIndex.get() === undefined) {
        const accountIndex = seedAccount.accountIndex.get() ?? 1;
        seedAccount.accountIndex.set(accountIndex - 1);
    }

    currentAddress.set(seedAddress);
    encryptedAccount.set(none);
    userAccount.set(none);
}

export const confirmTransaction = async (args: {
    contractId: string,
    transaction: TransactionJsonWait
}) : Promise<Transaction> => {

    const { contractId, transaction } = args;
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();

    if (!transaction.id) {
        throw new Error("Transaction id not found");
    }

    const transactionState = UserStore.accounts[address]
        .assets[networkId]
        .coins[contractId]
        .transactions[transaction.id];

    let blockNumber = null;
    try {
        const result = await transaction.wait();
        if (!result.blockNumber) {
            throw new Error("Unable to retrieve block number");
        }
        blockNumber = result.blockNumber;

    } catch (e) {
        transactionState.merge({ status: TRANSACTION_STATUS_ERROR });
        throw e;
    }

    transactionState.merge({
        blockNumber,
        status: TRANSACTION_STATUS_SUCCESS
    });

    refreshCoinBalance(transactionState.contractId.get());
    refreshMana();

    return transactionState.get();
}

export const setPassword = (password: string) => {
    EncryptedStore.merge({ password });
}

export const checkPassword = (password: string): boolean => {
    return password === EncryptedStore.password.get();
}

export const showToast = (args: {
    type: string,
    text1: string,
    text2?: string
}) => {
    Toast.show(args);
}

export const generateSeed = () => {
    return HDKoinos.randomMnemonic();
}

export const lock = () => {
    LockStore.set(true);
}

export const unlock = () => {
    LockStore.set(false);
}

export const setLocale = (locale: string) => {
    UserStore.locale.set(locale);
}

export const setTheme = (theme: string) => {
    UserStore.theme.set(theme);
}

export const setBiometric = (value: boolean) => {
    UserStore.biometric.set(value);
}

export const deleteCoin = (contractId: string) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();

    UserStore.accounts[address].assets[networkId].coins[contractId].set(none);
}

export const setAutolock = (autolock: number) => {
    UserStore.autolock.set(autolock);
}

export const setAccountName = (address: string, name: string) => {
    UserStore.accounts[address].name.set(name);
}

export const addContact = (item: Contact) => {
    UserStore.addressbook.merge({ [item.address]: item });
}

export const deleteContact = (address: string) => {
    UserStore.addressbook[address].set(none);
}

export const addNetwork = (network: Network) => {
    UserStore.networks.merge({
        [network.chainId]: network
    });
}

export const deleteNetwork = (networkId: string) => {
    UserStore.networks.merge({ [networkId]: none });
}

export const executeMigrations = () => {
    const sortedMigrations = Object.keys(migrations).sort();
    const latestVersion = sortedMigrations.reverse()[0];
    const currentVersion = UserStore.version.get();
    const migrationsToExecute = [];

    if (currentVersion < latestVersion) {
        for (const date of sortedMigrations) {
            if (currentVersion < date) {
                migrationsToExecute.push(date);
            }
        }
    }

    if (migrationsToExecute.length > 0) {
        for (const date of migrationsToExecute.reverse()) {
            try {
                migrations[date]();
                UserStore.version.set(date);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

export const initWC = async () => {
    if (WCStore.wallet.get()) {
        return;
    }

    const onSessionProposal = (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
        setWCPendingProposal(proposal);
    }

    const onSessionRequest = async (request: SignClientTypes.EventArguments["session_request"]) => {
        setWCPendingRequest(request);
    }

    const wallet = await initWCWallet();
    wallet.on("session_proposal", onSessionProposal);
    wallet.on("session_request", onSessionRequest);
    wallet.on("session_delete", () => {
        refreshWCActiveSessions();
    });
    WCStore.wallet.set(wallet);
}

export const pair = async (CURI: string) => {
    const wallet = WCStore.wallet.get();
    if (wallet) {
        await wallet.core.pairing.pair({ uri: CURI });
    }
}

export const acceptProposal = async (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => {
    const wallet = WCStore.wallet.get();
    if (!wallet) {
        throw new Error("WalletConnect wallet not initialized");
    }

    const currentAddress = UserStore.currentAddress.get();
    if (!currentAddress) {
        throw new Error("Current address not set");
    }

    unsetWCPendingProposal();

    const { id, params } = sessionProposal;
    const { requiredNamespaces, relays } = params;
    const namespaces: SessionTypes.Namespaces = {};

    for (const key in requiredNamespaces) {
        const accounts: string[] = [];
        requiredNamespaces[key].chains?.map((chain: string) => {
            [currentAddress].map((acc) => accounts.push(`${chain}:${acc}`));
        });

        namespaces[key] = {
            accounts,
            chains: requiredNamespaces[key].chains,
            methods: requiredNamespaces[key].methods,
            events: requiredNamespaces[key].events,
        };
    }

    await wallet.approveSession({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
    });

    refreshWCActiveSessions();
}

export const rejectProposal = async (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => {
    const wallet = WCStore.wallet.get();
    if (!wallet) {
        throw new Error("W3 Wallet not available");
    }

    unsetWCPendingProposal();

    const { id } = sessionProposal;
    await wallet.rejectSession({
        id,
        reason: getSdkError("USER_REJECTED_METHODS"),
    });
}

export const acceptRequest = async (sessionRequest: SignClientTypes.EventArguments["session_request"]) => {
    const wallet = WCStore.wallet.get();
    if (!wallet) {
        throw new Error("W3 Wallet not available");
    }

    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error("Current address not available");
    }

    unsetWCPendingRequest();

    const networkId = UserStore.currentNetworkId.get();
    const { params, id, topic } = sessionRequest;
    const { request } = params;
    const signer = getSigner({ address, networkId });
    let result: any = null;
    const provider = signer.provider;

    switch (request.method) {
        case WC_METHODS.SIGN_MESSAGE:
            result = await signMessage(signer, request.params.message);
            break;
        case WC_METHODS.SIGN_HASH:
            result = await signHash(signer, request.params.hash);
            break;
        case WC_METHODS.PREPARE_TRANSACTION:
            result = await prepareTransaction(signer, request.params.transaction);
            break;
        case WC_METHODS.SIGN_TRANSACTION:
            result = await signTransaction(signer, request.params.transaction, request.params.options?.abis);
            break;
        case WC_METHODS.SEND_TRANSACTION:
            result = await sendTransaction(signer, request.params.transaction, request.params.options);
            break;
        case WC_METHODS.SIGN_AND_SEND_TRANSACTION:
            result = await signAndSendTransaction(signer, request.params.transaction, request.params.options);
            break;
        case WC_METHODS.WAIT_FOR_TRANSACTION:
            result = await waitForTransaction(request.params.transactionId, request.params.type, request.params.timeout);
            break;
        case WC_METHODS.READ_CONTRACT:
            result = await provider?.readContract(request.params.operation);
            break;
        case WC_METHODS.JSON_RPC_CALL:
            result = await provider?.call(request.params.method, request.params.params);
            break;
        case WC_METHODS.GET_NONCE:
            result = await provider?.getNonce(request.params.address);
            break;
        case WC_METHODS.GET_NEXT_NONCE:
            result = await provider?.getNextNonce(request.params.address);
            break;
        case WC_METHODS.GET_ACCOUNT_RC:
            result = await provider?.getAccountRc(request.params.address);
            break;
        case WC_METHODS.GET_TRANSACTIONS_BY_ID:
            result = await provider?.getTransactionsById(request.params.transactionIds);
            break;
        case WC_METHODS.GET_BLOCKS_BY_ID:
            result = await provider?.getBlocksById(request.params.blockIds);
            break;
        case WC_METHODS.GET_HEAD_INFO:
            result = await provider?.getHeadInfo();
            break;
        case WC_METHODS.GET_CHAIN_ID:
            result = await provider?.getChainId();
            break;
        case WC_METHODS.GET_BLOCKS:
            result = await provider?.getBlocks(request.params.height, request.params.numBlocks, request.params.idRef);
            break;
        case WC_METHODS.GET_BLOCK:
            result = await provider?.getBlock(request.params.height);
            break;
        case WC_METHODS.SUBMIT_BLOCK:
            result = await provider?.submitBlock(request.params.block);
            break;
    }

    if (result !== null) {
        const response = formatJsonRpcResult(id, result);
        await wallet.respondSessionRequest({
            topic,
            response,
        });
    }
}

export const rejectRequest = async (sessionRequest: SignClientTypes.EventArguments["session_request"]) => {
    const wallet = WCStore.wallet.get();
    if (!wallet) {
        throw new Error("W3 Wallet not available");
    }

    unsetWCPendingRequest();

    const { id, topic } = sessionRequest;
    const response = formatJsonRpcError(id, getSdkError('USER_REJECTED').message);
    await wallet.respondSessionRequest({
        topic,
        response,
    });
}

export const logError = (text: string) => {
    console.log(text);
    UserStore.logs.merge([`${Date.now()}|ERROR|${text}`]);
}

export const logReset = () => {
    UserStore.logs.set([]);
}

export const refreshWCActiveSessions = () => {
    const wallet = WCStore.wallet.get();
    if (wallet) {
        WCStore.activeSessions.set(wallet.getActiveSessions());
    }
}

export const setWCPendingProposal = (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
    const wallet = WCStore.wallet.get();
    if (wallet) {
        WCStore.pendingProposal.set(proposal);
    }
}

export const unsetWCPendingProposal = () => {
    const wallet = WCStore.wallet.get();
    if (wallet) {
        WCStore.pendingProposal.set(none);
    }
}

export const setWCPendingRequest = (request: SignClientTypes.EventArguments["session_request"]) => {
    const wallet = WCStore.wallet.get();
    if (wallet) {
        WCStore.pendingRequest.set(request);
    }
}

export const unsetWCPendingRequest = () => {
    const wallet = WCStore.wallet.get();
    if (wallet) {
        WCStore.pendingRequest.set(none);
    }
}

export const refreshKap = async (search: string) => {
    if (isMainnet()) {
        if (search.includes('.')) {
            const address = await getKapAddressByName(search)
            if (address) {
                KapStore.merge({ [address]: search })
            }
        }

        const profile = await getKapProfileByAddress(search)
        if (profile) {
            KapStore.merge({ [search]: profile.name });
        }
    }
}

export const addNft = async (args: {
    contractId: string,
    tokenId: string
}) => {
    const { contractId, tokenId } = args;
    const key = `${contractId}/${tokenId}`;

    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const currentNfts = UserStore.accounts[address].nfts;
    const nfts = UserStore.nfts;

    if (currentNfts.get().includes(key)) {
        return nfts[key].get();
    }

    const contract = await getContract({
        address,
        networkId,
        contractId
    });

    const uriResp = await contract.functions.uri();
    const url = convertIpfsToHttps(uriResp.result?.value);

    const dataResponse = await fetch(`${url}/${tokenId}`);
    if (!dataResponse) {
        throw new Error(`Unable to retrieve NFT url ${url}/${tokenId}`);
    }

    const jsonResponse = await dataResponse.json();
    if (!jsonResponse) {
        throw new Error(`Unable to decode NFT url ${url}/${tokenId}`);
    }

    const nft: NFT = {
        name: jsonResponse.name ?? 'unknown',
        description: jsonResponse.description ?? 'unknown',
        image: jsonResponse.image ?? 'unknown',
        contractId,
        tokenId,
        transactions: {}
    };

    nfts.merge({ [key]: nft });
    currentNfts.merge([key]);
    return nfts[key].get();
}

export const deleteNft = (id: string) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }
    const nfts = UserStore.accounts[address].nfts;
    const index = nfts.get().indexOf(id);
    if (index > -1) {
        nfts[index].set(none);
    }
}


export const refreshCoins = (args?: {
    contract?: boolean,
    info?: boolean,
    balance?: boolean,
    price?: boolean
}) => {
    const currentAddress = UserStore.currentAddress;
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return;
    }

    const currentNetworkId = UserStore.currentNetworkId;

    const coins = UserStore.accounts
        .nested(currentAddressOrNull.get())
        .assets
        .nested(currentNetworkId.get())
        .coins;

    const promises = [];

    for (const contractId in coins) {
        const promise = refreshCoin({
            ...args,
            contractId
        });

        promises.push(promise);
    }

    return Promise.all(promises);
}

/**
 * refresh coin data
 */
export const refreshCoin = async(args: {
    contractId: string,
    contract?: boolean,
    info?: boolean,
    balance?: boolean,
    price?: boolean
}) => {
    const promises = [];

    if (args.contract === true) {
        await refreshCoinContract(args.contractId);
    }

    if (args.balance === true) {
        promises.push( refreshCoinBalance(args.contractId) );
    }

    if (args.info === true) {
        promises.push( refreshCoinInfo(args.contractId) );
    }

    if (args.price === true) {
        promises.push( refreshCoinPrice(args.contractId) );
    }

    return Promise.all(promises);
}

export const refreshCoinContract = (contractId: string) => {
    console.log('refresh contract', contractId);
    const currentAddress = UserStore.currentAddress;
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return;
    }

    const currentNetworkId = UserStore.currentNetworkId;
    const coin = UserStore.accounts
        .nested(currentAddressOrNull.get())
        .assets
        .nested(currentNetworkId.get())
        .coins
        .nested(contractId);

    return getCoinContract({
        contractId,
        address: currentAddressOrNull.get(),
        networkId: currentNetworkId.get()
    })
        .then(async contract => {
            if (contract.symbol) {
                coin.symbol.set(contract.symbol);
            }
            if (contract.decimal) {
                coin.decimal.set(contract.decimal);
            }
        })
        .catch(e => logError(e))
}

export const refreshCoinBalance = (contractId: string) => {
    console.log('refresh balance', contractId);
    const currentAddress = UserStore.currentAddress;
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return;
    }

    const currentNetworkId = UserStore.currentNetworkId;

    const coin = UserStore.accounts
        .nested(currentAddressOrNull.get())
        .assets
        .nested(currentNetworkId.get())
        .coins
        .nested(contractId);

    return getCoinBalance({
        contractId,
        address: currentAddressOrNull.get(),
        networkId: currentNetworkId.get()
    }).then(balance => {
        if (balance) {
            if (coin.decimal.get()) {
                coin.balance.set( parseFloat(utils.formatUnits(balance, coin.decimal.get())) );
            } else {
                coin.balance.set(balance);
            }
        } else {
            coin.balance.set(0);
        }

        if (contractId == UserStore.networks[currentNetworkId.get()].koinContractId.get()) {
            refreshMana();
        }
    })
    .catch(e => {
        logError(e)
    });
}

export const refreshCoinInfo = (contractId: string) => {
    console.log('refresh info', contractId);
    const currentAddress = UserStore.currentAddress;
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return;
    }

    const currentNetworkId = UserStore.currentNetworkId;

    const coin = UserStore.accounts
        .nested(currentAddressOrNull.get())
        .assets
        .nested(currentNetworkId.get())
        .coins
        .nested(contractId);

    return getContractInfo(contractId)
        .then(info => {
            if (info.logo) {
                coin.logo.set(info.logo);
            }
            if (info.name) {
                coin.name.set(info.name);
            }
        }).catch(e => {
            //unable to retrieve info
        })
}

export const refreshCoinPrice = async (contractId: string) => {
    console.log('refresh price', contractId);
    const currentAddress = UserStore.currentAddress;
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return;
    }

    const currentNetworkId = UserStore.currentNetworkId;

    const coin = UserStore.accounts
        .nested(currentAddressOrNull.get())
        .assets
        .nested(currentNetworkId.get())
        .coins
        .nested(contractId);

    return getCoinPrice(contractId)
        .then(price => {
            if (price) {
                coin.price.set(price);
            }
        }).catch(e => logError(e));
}