import { hookstate } from "@hookstate/core";
import { IManaActions, ManaState } from "../types/store";
import { getStore } from "./registry";

/**
 * Mana local store
 * It is used to provide global "mana" recharge
 * The "manaBar" is watching this store.mana value and it creates a setInterval to provide fake "live" mana recharge
 * Everytime someone calls "refreshMana" the store.mana value is updated and the manaBar is rendering again with a new interval
 * We call refreshMana actually in transactionConfirm, setCurrentNetwork and setCurrentAccount
 */
const ManaStoreDefault = {
    mana: 0,
    rcLimit: 95, 
    payer: '',
    lastUpdateMana: new Date().getTime()
};

const state = hookstate<ManaState>({...ManaStoreDefault});

const actions : IManaActions = {
    refreshMana: async () => {
        console.log('refresh mana (reset rcLImit and payer)');
        const accountId = getStore('Setting').state.currentAccountId.get();
        const address = getStore('Account').state.nested(accountId).address.get();
        const provider = getStore('Koin').getters.getProvider();
        const manaBalance = await provider.getAccountRc(address);
        const rcLimit = getStore('Setting').state.rcLimit.get();
    
        state.merge({
            mana: Number(manaBalance) / 1e8,
            rcLimit: parseInt(rcLimit),
            payer: address
        });
    },
    setRcLimit: (value: number) => {
        state.rcLimit.set(value);
    },
    setPayer: (payerId: string) => {
        state.payer.set(payerId);
    }
};

export default {
    state,
    actions
};