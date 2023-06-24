import { State, useHookstate } from "@hookstate/core";
import { CoinBalanceStore, UserStore, EncryptedStore, WithdrawStore, LockStore } from "../stores";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import locales from "../locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { UnlockNavigationProp } from "../types/navigation";

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

export const useCurrentAddress = (): State<string | null> => {
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
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
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

export const useAutolock = () => {
    return useHookstate(UserStore.autolock);
}

export const useLocker = (props: {
    key: string,
    initialValue: boolean
}) => {
    const { key, initialValue } = props;

    const navigation = useNavigation<UnlockNavigationProp>();
    const locker = useHookstate(LockStore[key]);
    const nextAppState = useAppState();
    const dateLock = useHookstate(0);
    const autoLock = useAutolock();

    //set locker initial value on mount
    //reset locker initial value on mount
    useEffect(() => {
        LockStore[key].set(initialValue);

        return () => {
            LockStore[key].set(initialValue);
        }
    }, []);

    //do redirect to "unlock" on locker true value
    useEffect(() => {
        if (locker.get() === true) {
            navigation.navigate('Unlock', { key });
        }
    }, [locker]);

    //autolock
    useEffect(() => {
        if (autoLock.get() > -1) {
            if (nextAppState.get() === 'background') {
                dateLock.set(Date.now() + autoLock.get());
            }
            else if (nextAppState.get() === 'active') {
                if (dateLock.get() > 0 && Date.now() > dateLock.get()) {
                    locker.set(true);
                }
            }
        }
    }, [nextAppState]);

    return {
        lock: () => {
            locker.set(true);
        },
        get: () => {
            return locker.get();
        },
        set: (val: boolean) => {
            locker.set(val);
        }
    };
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