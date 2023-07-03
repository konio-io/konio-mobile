import { State, hookstate } from "@hookstate/core";
import { DEFAULT_COINS, DEFAULT_NETWORK, DEFAULT_NETWORKS, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { UserStoreState, EncryptedStoreState } from "../types/store";
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
const UserStoreDefault: UserStoreState = {
    currentNetworkId: DEFAULT_NETWORK,
    currentAddress: null,
    wallets: {},
    coins: { ...DEFAULT_COINS },
    transactions: {},
    networks: { ...DEFAULT_NETWORKS },
    locale: OS_LOCALE,
    theme: OS_THEME,
    biometric: false,
    autolock: -1,
    addressbook: {},
    rcLimit: '100'
};
export const UserStore = hookstate(
    {... UserStoreDefault}, localstored({
        key: 'store',
        engine: AsyncStorage,
        isLoadingState: userStoreIsLoading,
        migrate: (state: State<UserStoreState>) => {
            if (!state.rcLimit.get()) {
                state.rcLimit.set(UserStoreDefault.rcLimit);
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
 * We call refreshMana actually in transactionConfirm, setCurrentNetwork and setCurrentWallet
 */
const ManaStoreDefault = {
    mana: 0,
    koin: 0,
    lastUpdateMana: new Date().getTime()
};
export const ManaStore = hookstate({...ManaStoreDefault});

/**
 * Coin balance local store
 * It is used to provide global coin balance
 */
export const CoinBalanceStoreDefault : Record<string,string> = {};
export const CoinBalanceStore : State<Record<string,string>> = hookstate({...CoinBalanceStoreDefault});

/**
 * Coin value local store
 * It is used to provide global coin value in dollars
 */
export const CoinValueStoreDefault : Record<string,number> = {};
export const CoinValueStore : State<Record<string,number>> = hookstate({...CoinValueStoreDefault});

/**
 * Reset
 */
export const reset = () => {
    ManaStore.set({...ManaStoreDefault});
    CoinBalanceStore.set({...CoinBalanceStoreDefault});
    CoinValueStore.set({...CoinValueStoreDefault});
    UserStore.set({...UserStoreDefault});
    EncryptedStore.set({...EncryptedStoreDefault});
};

/**
 * Lock by password
 */
export const LockStoreDefault : Record<string,boolean> = {};
export const LockStore = hookstate(LockStoreDefault);


