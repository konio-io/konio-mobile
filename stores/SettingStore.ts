import { State, hookstate } from "@hookstate/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";
import { DEFAULT_NETWORK, OS_LOCALE, OS_THEME } from "../lib/Constants";
import * as StoreReview from 'expo-store-review';
import type { SettingStore, Store, SettingState, SettingActions } from "./types";

export const SettingStoreLoaded = hookstate(false);

const state = hookstate<SettingState>(
    {
        currentNetworkId: DEFAULT_NETWORK,
        currentAccountId: '',
        locale: OS_LOCALE,
        theme: OS_THEME,
        biometric: false,
        autolock: -1,
        rcLimit: '95',
        version: '20230908',
        askReview: false
    },
    localstored({
        key: 'setting',
        engine: AsyncStorage,
        loaded :SettingStoreLoaded,
        migrate: (state: State<SettingState>) => {
            if (!state.version.get()) {
                state.version.set('20230701');
            }
        }
    })
);

export const useSettingStore = (store: () => Store) : SettingStore => {

    const actions : SettingActions = {
        setCurrentAccount: (address: string) => {
            state.currentAccountId.set(address);
            store().Coin.actions.refreshCoins({balance: true, price: true});
            store().Mana.actions.refreshMana();
        },
        
        setCurrentNetwork: (networkId: string) => {
            state.currentNetworkId.set(networkId);
            store().Coin.actions.refreshCoins({balance: true, price: true});
            store().Mana.actions.refreshMana();
        },
        
        setLocale: (locale: string) => {
            state.locale.set(locale);
        },
        
        setTheme: (theme: string) => {
            state.theme.set(theme);
        },
        
        setBiometric: (value: boolean) => {
            state.biometric.set(value);
        },
        
        setAutolock: (autolock: number) => {
            state.autolock.set(autolock);
        },
        
        showAskReview: async () => {
            if (state.askReview.get() === false) {
                if (await StoreReview.hasAction()) {
                    StoreReview.requestReview()
                    .then(() => state.askReview.set(true))
                    .catch(e => {
                        store().Log.actions.logError(e);
                        state.askReview.set(true)
                    });
                }
            }
        },
        
        setRcLimit: (value: string) => {
            state.rcLimit.set(value);
        },
    }
    
    return {
        state,
        actions
    }
}