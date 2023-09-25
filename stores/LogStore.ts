import { hookstate } from "@hookstate/core";
import { LogActions, LogState, LogStore, Store } from "./types";

const state = hookstate<LogState>([]);

export const useLogStore = (store: () => Store) : LogStore => {
    
    const actions : LogActions = {
        logError: (text: string) => {
            state.merge([text]);
        },
        
        logReset: () => {
            state.set([]);
        }
    }

    return {
        state,
        actions
    }
}