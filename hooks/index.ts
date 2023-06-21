import { State, useHookstate } from "@hookstate/core";
import { CoinBalanceStore, UserStore, EncryptedStore, WithdrawStore, LockStore } from "../stores";
import { getTheme } from "../themes";
import { useColorScheme} from 'react-native';
import locales from "../locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";

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
    const storeTheme = useHookstate(UserStore.theme).get();
    const systemTheme = useColorScheme() ?? FALLBACK_THEME;

    if (storeTheme === OS_THEME) {
        return getTheme(systemTheme);
    }

    return getTheme(storeTheme);
}

export const useWithdraw = () => {
    return useHookstate(WithdrawStore);
}

export const useLocker = (key: string, defaultValue?: boolean) => {
    if (LockStore[key].get() === undefined) {
        LockStore[key].set(defaultValue ?? true);
    }
    
    return useHookstate(LockStore[key]);
}

export const useCurrentSeed = () => {
    return Object.values(EncryptedStore.accounts).filter(w => w.seed.get() !== undefined)[0].seed;
}

const i18n = new I18n(locales);
export const useI18n = () => {
    let currentLocale = useHookstate(UserStore.locale).get();
    if (currentLocale === OS_LOCALE) {
        const systemLocale = getLocales()[0].languageCode;
        currentLocale = Object.keys(locales).includes(systemLocale) ?
            systemLocale :
            FALLBACK_LOCALE;
    }

    if (i18n.locale !== currentLocale) {
        i18n.locale = currentLocale;
    }

    return i18n;
}

export const useBiometric = () => {
    return useHookstate(UserStore.biometric);
}

export const useCurrentKoin = () => {
    const currentNetwork = useHookstate(UserStore.currentNetworkId);
    return UserStore.networks[currentNetwork.get()].koinContractId;
}