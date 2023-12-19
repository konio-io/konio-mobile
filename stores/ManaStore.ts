import { hookstate } from "@hookstate/core";
import { IManaActions, IManaGetters, ManaState } from "../types/store";
import { getStore } from "./registry";
import { DEFAULT_RC_LIMIT } from "../lib/Constants";

/**
 * Mana local store
 * It is used to provide global "mana" recharge
 * The "manaBar" is watching this store.mana value and it creates a setInterval to provide fake "live" mana recharge
 * Everytime someone calls "refreshMana" the store.mana value is updated and the manaBar is rendering again with a new interval
 * We call refreshMana actually in transactionConfirm, setCurrentNetwork and setCurrentAccount
 */
const ManaStoreDefault = {
    mana: 0,
    maxMana: 100, 
    payer: '',
    lastUpdateMana: new Date().getTime()
};

const state = hookstate<ManaState>({...ManaStoreDefault});

const actions : IManaActions = {
    refreshMana: async () => {
        console.log('refresh mana (reset maxMana and payer)');
        const accountId = getStore('Setting').state.currentAccountId.get();
        const address = getStore('Account').state.nested(accountId).address.get();
        const provider = getStore('Koin').getters.getProvider();
        const manaBalance = await provider.getAccountRc(address);
        const maxMana = getStore('Setting').state.maxMana.get();
    
        state.merge({
            mana: Number(manaBalance) / 1e8,
            maxMana,
            payer: address
        });
    },
    setMaxMana: (value: number) => {
        state.maxMana.set(value);
    },
    setPayer: (payerId: string) => {
        state.payer.set(payerId);
    }
};

const getters : IManaGetters = {
    getRcLimit: () => {
        const accountId = getStore('Setting').state.currentAccountId.get();
        const address = getStore('Account').state.nested(accountId).address.get();
        const payer = state.payer.get();
        const mana = state.mana.get();
        const maxMana = state.maxMana.get();

        if (address === payer) {
            return Math.trunc(((mana * Math.pow(10, 8)) * maxMana) / 100);
        }
     
        return DEFAULT_RC_LIMIT;
    }
}

export default {
    state,
    actions,
    getters
};