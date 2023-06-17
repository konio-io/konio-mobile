import { Contract, Provider, Signer, utils } from "koilib";
import { TransactionJsonWait } from "koilib/lib/interface";
import { ManaStore, CoinBalanceStore, UserStore, EncryptedStore } from "../stores";
import { Coin, Transaction, Wallet } from "../types/store";
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS, TRANSACTION_TYPE_WITHDRAW } from "../lib/Constants";
import HDKoinos from "../lib/HDKoinos";

import Toast from 'react-native-toast-message';
import { State } from "@hookstate/core";


export const setCurrentWallet = (address: string) => {
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
    
    const contractId = networks[networkId].koinContractId.get();
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
    const currentAddressOrNull : State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return;
    }

    const coins = UserStore.wallets[currentAddressOrNull.get()].coins.get()
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
    }).then(value => CoinBalanceStore[contractId].set(value));
}

export const withdrawCoin = async (args: { contractId: string, to: string, value: string, note: string}) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const { contractId, to, value, note } = args;
    const networkId = UserStore.currentNetworkId.get();
    const coin = UserStore.coins[contractId];
    const transactions = UserStore.transactions;

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
    const currentCoins = UserStore.wallets[address].coins;
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
    const networks = UserStore.networks;
    const wallets = UserStore.wallets;
    const wallet: Wallet = {
        name,
        address: address,
        coins: Object.values(networks.get()).map(n => n.koinContractId)
    };
    wallets.merge({ [wallet.address]: wallet });
}


export const addSeed = async (args: {
    seed: string,
    name: string
}) => {
    const accounts = EncryptedStore.accounts;
    const {seed, name} = args;
    const {address, privateKey} = await HDKoinos.createWallet(seed, 0);

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
    const wallet = Object.values(accounts.get()).find(w => w.seed !== undefined);

    if (!wallet) {
        throw new Error("Unable to find main seed wallet");
    }

    if (wallet.seed === undefined) {
        throw new Error("Provided wallet address is not a seed wallet");
    }

    if (wallet.accountIndex === undefined) {
        throw new Error("Provided wallet address does not have an accountIndex");
    }

    const {address, privateKey} = await HDKoinos.createWallet(wallet.seed, wallet.accountIndex + 1);

    addAddress(address, name);

    accounts.merge({
        [address]: {
            address,
            privateKey
        }
    });

    accounts[wallet.address].accountIndex.set(wallet.accountIndex + 1);
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

export const getProvider = (networkId: string): Provider => {
    const network = UserStore.networks[networkId];
    return new Provider([...network.rpcNodes.get()]);
}

export const getSigner = (args: {
    address: string,
    networkId: string
}): Signer => {
    const { address, networkId } = args;
    const account = EncryptedStore.accounts[address];
    const provider = getProvider(networkId);
    const signer = Signer.fromWif(account.privateKey.get());
    signer.provider = provider;
    return signer;
}

export const getContract = async (args: {
    address: string,
    networkId: string,
    contractId: string
}): Promise<Contract> => {
    const { address, networkId, contractId } = args;
    const signer = getSigner({ address, networkId });
    const provider = signer.provider;
    const contract = new Contract({
        id: contractId,
        provider,
        signer
    });

    await contract.fetchAbi();
    if (!contract.abi) {
        throw new Error("unable to fetch contract abi");
    }

    //Hack
    Object.keys(contract.abi.methods).forEach(m => {
        if (contract.abi) {
            if (contract.abi.methods[m].entry_point === undefined) {
                contract.abi.methods[m].entry_point = Number(contract.abi.methods[m]["entry-point"]);
            }
            if (contract.abi.methods[m].read_only === undefined) {
                contract.abi.methods[m].read_only = contract.abi.methods[m]["read-only"];
            }
        }
    });

    return contract;
}

export const getCoinBalance = async (args: {
    address: string,
    networkId: string,
    contractId: string,
    decimal: number
}) => {
    const { address, networkId, contractId, decimal } = args;
    const contract = await getContract({
        address,
        networkId,
        contractId
    });
    const response = await contract.functions.balance_of({ owner: address });
    if (response.result) {
        return utils.formatUnits(response.result.value, decimal);
    }

    return '0';
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