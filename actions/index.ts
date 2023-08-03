import { utils } from "koilib";
import { TransactionJsonWait } from "koilib/lib/interface";
import { ManaStore, CoinBalanceStore, UserStore, EncryptedStore, LockStore, CoinValueStore, WCStore, KapStore } from "../stores";
import { Contact, Coin, Network, Transaction, Account } from "../types/store";
import { DEFAULT_COINS, TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS, TRANSACTION_TYPE_WITHDRAW, WC_METHODS, WC_SECURE_METHODS } from "../lib/Constants";
import HDKoinos from "../lib/HDKoinos";
import Toast from 'react-native-toast-message';
import { State, none } from "@hookstate/core";
import { getCoinBalance, getContract, getProvider, getSigner, signMessage, prepareTransaction, sendTransaction, signAndSendTransaction, signHash, signTransaction, waitForTransaction, getKapProfileByAddress, getKapAddressByName } from "../lib/utils";
import migrations from "../stores/migrations";
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { initWCWallet } from "../lib/WalletConnect";

export const setCurrentAccount = (address: string) => {
    UserStore.currentAddress.set(address);
    refreshCoinListBalance();
    refreshMana();
}

export const setCurrentNetwork = (networkId: string) => {
    UserStore.currentNetworkId.set(networkId);
    refreshCoinListBalance();
    refreshMana();
}

export const refreshMana = async () => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const networks = UserStore.networks;
    const provider = getProvider(networkId);
    const manaBalance = await provider.getAccountRc(address)

    const contractId = networks[networkId].coins.KOIN.contractId.get();
    const koinBalance = await getCoinBalance({
        address,
        networkId,
        contractId,
        decimal: 8
    });

    ManaStore.merge({
        koin: parseFloat(koinBalance),
        mana: Number(manaBalance) / 1e8
    });
}

export const refreshCoinListBalance = () => {
    const currentAddress = UserStore.currentAddress;
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return;
    }

    const coins = UserStore.accounts[currentAddressOrNull.get()].coins.get()
        .filter((contractId: string) => {
            const coin = UserStore.coins[contractId];
            return coin.networkId.get() === UserStore.currentNetworkId.get();
        });

    for (const contractId of coins) {
        refreshCoinBalance(contractId);
    }
}

export const refreshCoinBalance = (contractId: string) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const coin = UserStore.coins[contractId];

    getCoinBalance({
        address,
        networkId,
        contractId,
        decimal: coin.decimal.get()
    }).then(value => {
        CoinBalanceStore[contractId].set(value);
        refreshCoinValue(contractId);
    });
}

export const refreshCoinValue = (contractId: string) => {
    fetch("https://www.mexc.com/open/api/v2/market/ticker?symbol=koin_usdt")
        .then(response => response.json())
        .then(json => {
            const price = Number(json.data[0].last);
            const balanceKoin = parseFloat(CoinBalanceStore[contractId].get());
            const value = Number(balanceKoin * price);
            CoinValueStore[contractId].set(value);
        })
        .catch(e => {
            logError(e);
            CoinValueStore[contractId].set(0);
        });
}

export const withdrawCoin = async (args: { contractId: string, to: string, value: string, note: string }) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const { contractId, to, value, note } = args;
    const networkId = UserStore.currentNetworkId.get();
    const coin = UserStore.coins[contractId];
    const transactions = UserStore.transactions;
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
        type: TRANSACTION_TYPE_WITHDRAW,
        status: TRANSACTION_STATUS_PENDING,
        note
    };

    transactions.merge({ [tsx.transactionId]: tsx });
    coin.transactions.merge([tsx.transactionId]);
    return transaction;
}


export const addCoin = async (contractId: string) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const currentCoins = UserStore.accounts[address].coins;
    const coins = UserStore.coins;

    if (currentCoins.get().includes(contractId)) {
        return coins[contractId].get();
    }

    const contract = await getContract({
        address,
        networkId,
        contractId
    });

    const [decimalResponse, symbolResponse] = await Promise.all([
        contract.functions.decimals(),
        contract.functions.symbol()
    ]);

    if (!decimalResponse.result || !symbolResponse.result) {
        throw new Error("unable to retrieve coin decimal/symbol");
    }

    const coin: Coin = {
        decimal: decimalResponse.result.value,
        symbol: symbolResponse.result.value,
        contractId,
        transactions: [],
        networkId,
    };

    coins.merge({ [contractId]: coin });
    currentCoins.merge([contractId]);
    return coins[contractId].get();
}

const addAddress = (address: string, name: string) => {
    const coins = [];
    const networks = Object.values(UserStore.networks.get());
    for (const network of networks) {
        for (const symbol of DEFAULT_COINS) {
            if (symbol === 'KOIN' || symbol === 'VHP') {
                coins.push(network.coins[symbol].contractId);
            }
        }
    }

    const accounts = UserStore.accounts;
    const account: Account = {
        name,
        address,
        coins
    };
    accounts.merge({ [account.address]: account });
}

export const addSeed = async (args: {
    seed: string,
    name: string
}) => {
    const accounts = EncryptedStore.accounts;
    const { seed, name } = args;
    const { address, privateKey } = await HDKoinos.createWallet(seed, 0);

    addAddress(address, name);

    accounts.merge({
        [address]: {
            address,
            privateKey,
            seed,
            accountIndex: 0
        }
    });

    return address;
}

export const addAccount = async (name: string) => {
    const accounts = EncryptedStore.accounts;
    const account = Object.values(accounts.get()).find(w => w.seed !== undefined);

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

    addAddress(address, name);

    accounts.merge({
        [address]: {
            address,
            privateKey
        }
    });

    accounts[account.address].accountIndex.set(account.accountIndex + 1);
    return address;
}

export const confirmTransaction = async (transaction: TransactionJsonWait): Promise<Transaction> => {
    if (!transaction.id) {
        throw new Error("Transaction id not found");
    }

    const transactionState = UserStore.transactions[transaction.id];
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
    const coins = UserStore.accounts[address].coins;
    const index = coins.get().indexOf(contractId);
    if (index > -1) {
        coins[index].set(none);
        CoinBalanceStore[contractId].set(none);
        CoinValueStore[contractId].set(none);
    }
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

export const refreshKap = (search: string) => {
    if (search.includes('.')) {
        return getKapAddressByName(search)
        .then(address => {
            if (address) {
                KapStore.merge({[address] : search})
            }
        });
    }

    return getKapProfileByAddress(search)
        .then(profile => {
            if (profile) {
                KapStore.merge({[search]: profile.name});
            }
        });
}