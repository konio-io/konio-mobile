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
        let errorString = (new Date()).toISOString().replace('T',' ').substring(0,19);
        
        if (typeof error === 'string') {
            errorString += '|' + error;
        } else {
            errorString += '|' + error.toString();
        }

        state.merge([errorString]);
    },
    
    logReset: () => {
        state.set([]);
    }
}

export default {
    state,
    actions
};