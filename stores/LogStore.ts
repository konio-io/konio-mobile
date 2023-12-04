import { hookstate } from "@hookstate/core";
import { ILogActions, LogState } from "../types/store";
import { localstored } from '@hookstate/localstored';
import AsyncStorage from "@react-native-async-storage/async-storage";

const state = hookstate<LogState>(
    [], 
    localstored({
        key: 'log',
        engine: AsyncStorage,
    })
)

const actions : ILogActions = {
    logError: (error: any) => {
        console.error(error);
        if (typeof error === 'string') {
            state.merge([error]);
        } else {
            state.merge([error.toString()]);
        }
    },
    
    logReset: () => {
        state.set([]);
    }
}

export default {
    state,
    actions
};