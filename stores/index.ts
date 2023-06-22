import { State, hookstate } from "@hookstate/core";
import { DEFAULT_COINS, DEFAULT_NETWORK, DEFAULT_NETWORKS, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { UserStoreState, EncryptedStoreState, Withdraw } from "../types/store";
import { localstored } from "@hookstate/localstored";
import * as ExpoSecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";


/**
 * User "clear" store
 * It is used to store persistently the user settings and preferences
 */
const UserStoreDefault: UserStoreState = {
    currentNetworkId: DEFAULT_NETWORK,
    currentAddress: null,
    wallets: {},
    coins: DEFAULT_COINS,
    transactions: {},
    networks: DEFAULT_NETWORKS,
    locale: OS_LOCALE,
    theme: OS_THEME,
    biometric: false,
    autolock: -1
};
export const UserStore = hookstate(
    {... UserStoreDefault}, localstored({
        key: 'store',
        engine: AsyncStorage
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
        }
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
 * Reset
 */
export const reset = () => {
    ManaStore.set({...ManaStoreDefault});
    CoinBalanceStore.set({...CoinBalanceStoreDefault});
    UserStore.set({...UserStoreDefault});
    EncryptedStore.set({...EncryptedStoreDefault});
};

/**
 * Withdraw wizard store
 */
export const WithdrawStoreDefault : Withdraw = {
    contractId: UserStore.networks[UserStore.currentNetworkId.get()].koinContractId.get(),
    amount: 0,
    address: undefined,
};
export const WithdrawStore = hookstate(WithdrawStoreDefault);

/**
 * Lock by password
 */
export const LockStoreDefault : Record<string,boolean> = {};
export const LockStore = hookstate(LockStoreDefault);