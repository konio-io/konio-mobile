import { hookstate } from "@hookstate/core";
import { SpinnerActions, SpinnerState, SpinnerStore, Store } from "./types";

const state = hookstate<SpinnerState>(false);

export const useSpinnerStore = (store: () => Store) : SpinnerStore => {
    
    const actions : SpinnerActions = {
        showSpinner: () => {
            state.set(true);
        },
        
        hideSpinner: () => {
            state.set(false);
        }
    }

    return {
        state,
        actions
    }
}