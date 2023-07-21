import { State, hookstate } from "@hookstate/core";
import { DEFAULT_NETWORK, DEFAULT_NETWORKS, DONATION_ADDRESS, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { UserStoreState, EncryptedStoreState } from "../types/store";
import * as ExpoSecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";
import { IWeb3Wallet } from "@walletconnect/web3wallet";
import { SessionTypes } from "@walletconnect/types";

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
    coins: {
        [Object.values(DEFAULT_NETWORKS)[0].coins.KOIN.contractId] : Object.values(DEFAULT_NETWORKS)[0].coins.KOIN,
        [Object.values(DEFAULT_NETWORKS)[0].coins.VHP.contractId] : Object.values(DEFAULT_NETWORKS)[0].coins.VHP,
        [Object.values(DEFAULT_NETWORKS)[1].coins.KOIN.contractId] : Object.values(DEFAULT_NETWORKS)[1].coins.KOIN,
        [Object.values(DEFAULT_NETWORKS)[1].coins.VHP.contractId] : Object.values(DEFAULT_NETWORKS)[1].coins.VHP,
    },
    transactions: {},
    networks: { ...DEFAULT_NETWORKS },
    locale: OS_LOCALE,
    theme: OS_THEME,
    biometric: false,
    autolock: -1,
    addressbook: {
        [DONATION_ADDRESS]: {
            name: 'Konio Donations',
            address: DONATION_ADDRESS
        }
    },
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


/**
 * WalletConnect web3 wallet
 */
export const W3WStore = hookstate<IWeb3Wallet|null>(null);

/**
 * WalletConnect sessions
 */
export const W3WSessionsStore = hookstate<Record<string, SessionTypes.Struct>>({});