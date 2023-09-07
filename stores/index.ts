import { State, hookstate } from "@hookstate/core";
import { DEFAULT_NETWORK, DEFAULT_NETWORKS, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { UserStoreState, EncryptedStoreState, WCStoreState } from "../types/store";
import * as ExpoSecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";

/**
 * Global states to track if async-storage is loading stored data
 */
export const userStoreIsLoading = hookstate(true);
export const encryptedStoreIsLoading = hookstate(true);

/**
 * User "clear" store
 * It is used to store persistently the user settings and preferences
 */
export const UserStoreDefault: UserStoreState = {
    currentNetworkId: DEFAULT_NETWORK,
    currentAddress: null,
    accounts: {},
    networks: { ...DEFAULT_NETWORKS },
    locale: OS_LOCALE,
    theme: OS_THEME,
    biometric: false,
    autolock: -1,
    addressbook: {},
    rcLimit: '95',
    version: '20230705',
    logs: []
};
export const UserStore = hookstate(
    {... UserStoreDefault}, localstored({
        key: 'store',
        engine: AsyncStorage,
        isLoadingState: userStoreIsLoading,
        migrate: (state: State<UserStoreState>) => {
            if (!state.version.get()) {
                state.version.set('20230701');
            }
        }
    })
);

/**
 * Encrypted store
 * It is used to store persistently the wallet private keys and sensible data
 */
const EncryptedStoreDefault: EncryptedStoreState = {
    accounts: {},
    password: ''
};
export const EncryptedStore = hookstate(
    { ... EncryptedStoreDefault}, localstored({
        key: 'encryptedStore',
        engine: {
            getItem: (key: string) => {
                return ExpoSecureStore.getItemAsync(key);
            },
            setItem: (key: string, value: string) => {
                return ExpoSecureStore.setItemAsync(key, value);
            },
            removeItem: (key: string) => {
                return ExpoSecureStore.deleteItemAsync(key);
            }
        },
        isLoadingState: encryptedStoreIsLoading
    })
);

/**
 * Mana local store
 * It is used to provide global "mana" recharge
 * The "manaBar" is watching this store.mana value and it creates a setInterval to provide fake "live" mana recharge
 * Everytime someone calls "refreshMana" the store.mana value is updated and the manaBar is rendering again with a new interval
 * We call refreshMana actually in transactionConfirm, setCurrentNetwork and setCurrentAccount
 */
const ManaStoreDefault = {
    mana: 0,
    koin: 0,
    lastUpdateMana: new Date().getTime()
};
export const ManaStore = hookstate({...ManaStoreDefault});

/**
 * Reset
 */
export const reset = () => {
    ManaStore.set({...ManaStoreDefault});
    UserStore.set({...UserStoreDefault});
    EncryptedStore.set({...EncryptedStoreDefault});
};

/**
 * Lock by password
 */
export const LockStore = hookstate(true);

/**
 * WalletConnect store
 */
export const WCStoreDefault : WCStoreState = {
    wallet: null,
    activeSessions: {},
    pendingProposal: null,
    pendingRequest: null
}
export const WCStore = hookstate(WCStoreDefault);

/**
 * Kap store
 */
export const KapStore = hookstate<Record<string,string>>({});