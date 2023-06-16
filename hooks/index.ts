import { State, useHookstate } from "@hookstate/core";
import { CoinBalanceStore, UserStore, EncryptedStore } from "../stores";
import { getTheme } from "../themes";
import { Theme } from "../types/store";
import { useColorScheme} from 'react-native';

export const useNetworks = () => {
    const networks = useHookstate(UserStore.networks);
    return useHookstate(Object.values(networks.get()));
}

export const useWallets = () => {
    const wallets = useHookstate(UserStore.wallets);
    return useHookstate(Object.values(wallets.get()));
}

export const useNetwork = (networkId: string) => {
    return useHookstate(UserStore.networks[networkId]);
}

export const useCurrentNetworkId = () => {
    return useHookstate(UserStore.currentNetworkId);
}

export const useCurrentAddress = () : State<string|null> => {
    return useHookstate(UserStore.currentAddress);
}

export const useWallet = (address: string) => {
    return useHookstate(UserStore.wallets[address]);
}

export const useCoin = (contractId: string) => {
    return useHookstate(UserStore.coins[contractId]);
}

export const useCoinBalance = (contractId: string) => {
    return useHookstate(CoinBalanceStore[contractId]);
}

/**
 * Current wallet coins
 * @returns 
 */
export const useCoins = () => {
    const currentAddress = useHookstate(UserStore.currentAddress);
    const currentAddressOrNull : State<string> | null = currentAddress.ornull;
    if (currentAddressOrNull) {
        return useHookstate(UserStore.wallets[currentAddressOrNull.get()].coins);
    }
    return useHookstate([]);
}


/**
 * Current wallet/network/coin transactions
 * @param contractId 
 * @returns 
 */
export const useCoinTransactions = (contractId: string) => {
    const currentAddress = useHookstate(UserStore.currentAddress);
    const coinTransactions = useHookstate(UserStore.coins[contractId].transactions);
    const transactions = useHookstate(UserStore.transactions);

    const result = coinTransactions
        .get()
        .map(transactionId => transactions[transactionId].get())
        .filter(transaction => transaction.from === currentAddress.get());

    return useHookstate(result);
}

export const useTransaction = (transactionId: string) => {
    return useHookstate(UserStore.transactions[transactionId]);
}

export const usePassword = () => {
    return useHookstate(EncryptedStore.password);
}

export const useTheme = () => {
    const color = useColorScheme() ?? "light";

    return {
        get: () : Theme => getTheme(color)
    }
}