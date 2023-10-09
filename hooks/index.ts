import { useHookstate } from "@hookstate/core";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import Locales from "../lib/Locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { useEffect, useState } from "react";
import { SettingStore, CoinStore, AccountStore, NetworkStore, NameserverStore, LockStore, NftCollectionStore } from "../stores";
import { loadedState } from "../stores/registry";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { migrations } from "../stores/migrations";

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
        total.set(0);
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

export const useHydrated = () => {
    const loaded = useHookstate(loadedState);
    const [state, setState] = useState(false);

    useEffect(() => {
        if (
            loaded.get().setting === true
            && loaded.get().secure === true
            && loaded.get().account === true
            && loaded.get().coin === true
            && loaded.get().network === true
        ) {
            setState(true);
        }
    }, [loaded])

    return state;
}

export const useNeedMigration = (hydrated: boolean) => {
    const [state, setState] = useState(false);

    useEffect(() => {
        if (hydrated) {

            //ToDo: remove it in the next releases
            AsyncStorage.getItem('store').then(contentStr => {
                if (contentStr) {
                    const content = JSON.parse(contentStr);
                    if (content.version) {
                        SettingStore.state.version.set(content.version);
                    }
                }

                const currentVersion = SettingStore.state.version.get();
                const sortedMigrations = Object.keys(migrations).sort();
                const latestVersion = sortedMigrations.reverse()[0];
                if (currentVersion < latestVersion) {
                    setState(true);
                }
            });
        }
    },[hydrated]);

    return state;
}

export const useCoins = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetworkId = useHookstate(SettingStore.state.currentNetworkId).get();
    const coins = useHookstate(CoinStore.state).get();

    return Object.values(coins).filter(coin => 
        coin.networkId === currentNetworkId
        && coin.accountId === currentAccountId
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