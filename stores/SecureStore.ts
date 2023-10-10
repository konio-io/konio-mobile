import { hookstate, none } from "@hookstate/core";
import { AccountSecure, ISecureActions, ISecureGetters, SecureState } from "../types/store";
import * as ExpoSecureStore from 'expo-secure-store';
import { localstored } from "../lib/localstored";
import { loadedState } from "./registry";

const state = hookstate<SecureState>(
    {
        accounts: {},
        password: ''
    }, 
    localstored({
        key: 'secure',
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
        loadedState: loadedState.secure
    })
);

const actions : ISecureActions = {
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
        if (account) {
            if (!account.accountIndex?.get()) {
                actions.deIncrementIndex();
            }

            account.set(none);
        }
    },
    
    addAccount: (account: AccountSecure) => {
        state.accounts.merge({
            [account.address]: account
        });

        if (account.accountIndex === undefined) {
            actions.incrementIndex();
        }
    }
}

const getters : ISecureGetters = {
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

export default {
    state,
    actions,
    getters
}