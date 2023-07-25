import { State, useHookstate } from "@hookstate/core";
import { CoinBalanceStore, UserStore, EncryptedStore, LockStore, CoinValueStore, WCStore } from "../stores";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import Locales from "../lib/Locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { UnlockNavigationProp } from "../types/navigation";

export const useNetworks = () => {
    return useHookstate(UserStore.networks);
}

export const useAccounts = () => {
    return useHookstate(UserStore.accounts);
}

export const useNetwork = (networkId: string) => {
    return useHookstate(UserStore.networks[networkId]);
}

export const useCurrentNetworkId = () => {
    return useHookstate(UserStore.currentNetworkId);
}

export const useCurrentAddress = (): State<string | null> => {
    return useHookstate(UserStore.currentAddress);
}

export const useAccount = (address: string) => {
    return useHookstate(UserStore.accounts[address]);
}

export const useCoin = (contractId: string) => {
    return useHookstate(UserStore.coins[contractId]);
}

export const useCoinBalance = (contractId: string) => {
    return useHookstate(CoinBalanceStore[contractId]);
}

export const useCoinValue = (contractId: string) => {
    return useHookstate(CoinValueStore[contractId]);
}

/**
 * Current account coins
 * @returns 
 */
export const useCoins = () => {
    const currentAddress = useHookstate(UserStore.currentAddress);
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (currentAddressOrNull) {
        return useHookstate(UserStore.accounts[currentAddressOrNull.get()].coins);
    }
    return useHookstate([]);
}


/**
 * Current account/network/coin transactions
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

export const useTransactions = () => {
    return useHookstate(UserStore.transactions);
}

export const useAddressbook = () => {
    return useHookstate(UserStore.addressbook);
}

export const useContact = (address: string) => {
    return useHookstate(UserStore.addressbook[address]);
}

export const useTheme = () => {
    const storeTheme = useHookstate(UserStore.theme).get();
    const systemTheme = useColorScheme() ?? FALLBACK_THEME;

    if (storeTheme === OS_THEME) {
        return getTheme(systemTheme);
    }

    return getTheme(storeTheme);
}

export const useCurrentSeed = () => {
    return Object.values(EncryptedStore.accounts).filter(w => w.seed.get() !== undefined)[0].seed;
}

const i18n = new I18n(Locales);
export const useI18n = () => {
    let currentLocale = useHookstate(UserStore.locale).get();
    if (currentLocale === OS_LOCALE) {
        const systemLocale = getLocales()[0].languageCode;
        currentLocale = Object.keys(Locales).includes(systemLocale) ?
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
    return UserStore.networks[currentNetwork.get()].coins.KOIN.contractId;
}

export const useAutolock = () => {
    return useHookstate(UserStore.autolock);
}

export const useRcLimit = () => {
    return useHookstate(UserStore.rcLimit);
}

export const useAppState = () => {
    const appState = useHookstate('active');

    useEffect(() => {
        const appStateListener = AppState.addEventListener(
            'change',
            nextAppState => {
                appState.set(nextAppState);
            },
        );

        return () => {
            appStateListener?.remove();
        };
    }, []);

    return appState;
}

export const useWC = () => {
    return useHookstate(WCStore);
}

export const useLogs = () => {
    return useHookstate(UserStore.logs);
}

export const useLock = () => {
    return useHookstate(LockStore);
}