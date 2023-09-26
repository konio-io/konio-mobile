import { hookstate } from "@hookstate/core";
import { ILockActions, LockState } from "../types/store";

const state = hookstate<LockState>(false);

const actions : ILockActions = {
    lock: () => {
        state.set(true);
    },
    
    unlock: () => {
        state.set(false);
    }
}

export default {
    state,
    actions
};