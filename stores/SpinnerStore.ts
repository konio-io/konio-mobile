import { hookstate } from "@hookstate/core";
import { ISpinnerActions, SpinnerState } from "../types/store";

const state = hookstate<SpinnerState>(false);

const actions : ISpinnerActions = {
    showSpinner: () => {
        state.set(true);
    },
    
    hideSpinner: () => {
        state.set(false);
    }
}

export default {
    state,
    actions
};