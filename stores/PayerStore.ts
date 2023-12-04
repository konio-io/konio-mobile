import { hookstate } from "@hookstate/core";
import { IPayerGetters, IPayerActions, Payer, PayerState } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "../lib/localstored";
import { getStore, loadedState } from "./registry";
import { PAYERS_URL } from "../lib/Constants";

const state = hookstate<PayerState>(
    {}, 
    localstored({
        key: 'payer',
        engine: AsyncStorage,
        loadedState: loadedState.payer
    })
)

const actions : IPayerActions = {
    refreshPayers: async () => {
        type PayerJson = {
            address: string,
            name: string,
            chainId: string
        }

        const response = await fetch(`${PAYERS_URL}/index.json`);
        const responseJson : Array<PayerJson> = await response.json();
        const payers : Record<string,Payer> = {};

        for (const item of Object.values(responseJson)) {
            payers[item.address] = {
                id: item.address,
                address: item.address,
                networkId: item.chainId,
                name: item.name
            } 
        }

        state.set(payers);
    },
}

const getters : IPayerGetters = {
    getCurrentPayers: () => {
        const networkId = getStore('Setting').state.currentNetworkId.get();
        const accountId = getStore('Setting').state.currentAccountId.get();
        const account = getStore('Account').state.nested(accountId).get();

        const defaultPayers = Object.values(state.get()).filter(payer => payer.networkId === networkId);
        const selfPayer : Payer = {
            id: account.address,
            address: account.address,
            networkId,
            name: `${account.name} (default)`
        };

        return [
            selfPayer,
            ...defaultPayers
        ];
    }
}

export default {
    state,
    getters,
    actions
};