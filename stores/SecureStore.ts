import { hookstate, none } from "@hookstate/core";
import { AccountSecure, SecureActions, SecureState, SecureStore, Store } from "./types";
import * as ExpoSecureStore from 'expo-secure-store';
import { localstored } from "./localstored";

export const SecureStoreLoaded = hookstate(false);

const state = hookstate<SecureState>(
    {
        accounts: {},
        password: ''
    }, 
    localstored({
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
        loaded: SecureStoreLoaded
    })
);

export const useSecureStore = (store: () => Store): SecureStore => {

    const actions : SecureActions = {
        setPassword: (password: string) => {
            state.merge({ password });
        },

        deIncrementIndex: () => {
            const seedAccountId = getters.getSeedAccountId();
            if (seedAccountId) {
                const seedAccount = state.accounts.nested(seedAccountId);
                const index = seedAccount.accountIndex.get() ?? 1;
                seedAccount.accountIndex.set(index - 1);
            }
        },

        incrementIndex: () => {
            const seedAccountId = getters.getSeedAccountId();
            if (seedAccountId) {
                const seedAccount = state.accounts.nested(seedAccountId);
                const index = seedAccount.accountIndex.get() ?? 1;
                seedAccount.accountIndex.set(index + 1);
            }
        },

        deleteAccount: (id: string) => {
            const account = state.accounts.nested(id);
            account.set(none);

            if (!account.accountIndex.get()) {
                actions.deIncrementIndex();
            }
        },
        
        addAccount: (account: AccountSecure) => {
            state.merge({
                [account.address]: account
            });

            if (!account.accountIndex) {
                actions.incrementIndex();
            }
        }
    }

    const getters = {
        getSeedAccountId: () => {
            const seedAccount = Object.values(state.accounts.get()).find(account => account.seed);
            return seedAccount?.address;
        },
        getSeed: () => {
            const seedAccountId = getters.getSeedAccountId();
            if (seedAccountId) {
                return state.accounts.nested(seedAccountId).seed.get();
            }
            return undefined;
        },
        checkPassword: (password: string): boolean => {
            return password === state.password.get();
        },
    }

    return {
        state,
        actions,
        getters
    }
}



