import { hookstate } from "@hookstate/core";
import { LockActions, LockState, LockStore, Store } from "./types";

const state = hookstate<LockState>(false);

export const useLockStore = (store: () => Store) : LockStore => {
    
    const actions : LockActions = {
        lock: () => {
            state.set(true);
        },
        
        unlock: () => {
            state.set(false);
        }
    }

    return {
        state,
        actions
    }
}