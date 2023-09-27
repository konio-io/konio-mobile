import { useHookstate } from "@hookstate/core";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import Locales from "../lib/Locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { useEffect, useState } from "react";
import { SettingStore, SecureStore, CoinStore, AccountStore, NetworkStore, KapStore, LockStore, NftCollectionStore } from "../stores";

export const useTheme = () => {
    const storeTheme = useHookstate(SettingStore.state.theme).get();
    const systemTheme = useColorScheme() ?? FALLBACK_THEME;

    if (storeTheme === OS_THEME) {
        return getTheme(systemTheme);
    }

    return getTheme(storeTheme);
}

const i18n = new I18n(Locales);
export const useI18n = () => {
    let currentLocale = useHookstate(SettingStore.state.locale).get();
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

    return appState.get();
}

export const useAutolock = () => {
    return useHookstate(SettingStore.state.autolock).get();
}

export const useLockState = () => {
    return useHookstate(LockStore.state);
}

export const useAccountValue = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetworkId = useHookstate(SettingStore.state.currentNetworkId).get();
    const coins = useHookstate(CoinStore.state);
    const total = useHookstate(0);

    useEffect(() => {
        const coinList = Object.values(coins.get({ noproxy: true })).filter(coin =>
            coin.networkId === currentNetworkId &&
            coin.accountId === currentAccountId
        );
        if (coinList) {
            for (const coin of coinList) {
                if (coin.balance && coin.price) {
                    total.set(total.get() + coin.balance * coin.price);
                }
            }
        } else {
            total.set(0);
        }
    }, [currentAccountId, currentNetworkId, coins]);

    return total.get();
}

export const useCurrentAccount = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    return AccountStore.state.nested(currentAccountId).get();
}

export const useCurrentNetwork = () => {
    const currentNetworkId = useHookstate(SettingStore.state.currentNetworkId).get();
    return NetworkStore.state.nested(currentNetworkId).get();
}

export const useCurrentAccountId = () => {
    return useHookstate(SettingStore.state.currentAccountId).get();
}

export const useCurrentNetworkId = () => {
    return useHookstate(SettingStore.state.currentNetworkId).get();
}

export const useKapAddress = (address: string) => {
    const name = useHookstate(KapStore.state.nested(address));
    return name?.ornull ? name.get() : undefined;
}

export const useKapName = (name: string) => {
    const store = useHookstate(KapStore.state);
    const address = useHookstate('');
    let foundAddress = '';

    for (const addr in store.get()) {
        if (store.nested(addr).get() === name) {
            foundAddress = addr;
            break;
        }
    }
    address.set(foundAddress);

    return address?.ornull ? address.get() : undefined;
}

export const useHydrated = () => {
    const setting = useHookstate(SettingStore.state);
    const secure = useHookstate(SecureStore.state);
    const account = useHookstate(AccountStore.state);
    const coin = useHookstate(CoinStore.state);
    const network = useHookstate(NetworkStore.state);
    const [state, setState] = useState(false);

    useEffect(() => {
        if (
            setting?.ornull?.get()
            && secure?.ornull?.get()
            && account?.ornull?.get()
            && coin?.ornull?.get()
            && network?.ornull?.get()
        ) {
            setState(true);
        }
    }, [setting, secure, account, coin, network])

    return state;
}

export const useCoins = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetworkId = useHookstate(SettingStore.state.currentNetworkId).get();
    const coins = useHookstate(CoinStore.state).get();

    return Object.values(coins).filter(
        coin => coin.networkId === currentNetworkId &&
            coin.accountId === currentAccountId
    );
}

export const useNftCollections = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetworkId = useHookstate(SettingStore.state.currentNetworkId).get();
    const nftCollections = useHookstate(NftCollectionStore.state).get();

    return Object.values(nftCollections).filter(nft => 
        nft.networkId === currentNetworkId &&
        nft.accountId === currentAccountId
    );
}

export const useKoinBalance = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetwork = useCurrentNetwork();
    const coinId = CoinStore.getters.coinId(currentAccountId, currentNetwork.id, currentNetwork.koinContractId);
    return useHookstate(CoinStore.state.nested(coinId).balance).get() ?? 0;
}