import { hookstate } from "@hookstate/core";
import { ManaActions, ManaState, ManaStore, Store } from "./types";
/**
 * Mana local store
 * It is used to provide global "mana" recharge
 * The "manaBar" is watching this store.mana value and it creates a setInterval to provide fake "live" mana recharge
 * Everytime someone calls "refreshMana" the store.mana value is updated and the manaBar is rendering again with a new interval
 * We call refreshMana actually in transactionConfirm, setCurrentNetwork and setCurrentAccount
 */
const ManaStoreDefault = {
    mana: 0,
    lastUpdateMana: new Date().getTime()
};

const state = hookstate<ManaState>({...ManaStoreDefault});

export const useManaStore = (store: () => Store) : ManaStore => {
    
    const actions : ManaActions = {
        refreshMana: async () => {
            console.log('refresh mana');
            const accountId = store().Setting.state.currentAccountId.get();
            const address = store().Account.state.nested(accountId).address.get();
            const provider = store().Koin.getters.getProvider();
            const manaBalance = await provider.getAccountRc(address);
        
            state.merge({
                mana: Number(manaBalance) / 1e8
            });
        }
    }

    return {
        state,
        actions
    }
}