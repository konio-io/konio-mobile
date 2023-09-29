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
    logError: (text: any) => {
        console.error(text);
        state.merge([text]);
    },
    
    logReset: () => {
        state.set([]);
    }
}

export default {
    state,
    actions
};