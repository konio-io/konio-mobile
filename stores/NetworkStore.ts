import { hookstate, none } from "@hookstate/core";
import { Network, INetworkActions, INetworkGetters, NetworkState } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from '@hookstate/localstored';
import { DEFAULT_NETWORKS, MAINNET } from "../lib/Constants";
import { getStore } from "./registry";

const state = hookstate<NetworkState>(
    DEFAULT_NETWORKS, 
    localstored({
        key: 'network',
        engine: AsyncStorage,
    })
)

const actions : INetworkActions = {
    addNetwork: (network: Network) => {
        state.merge({
            [network.chainId]: network
        });
    },
    
    deleteNetwork: (networkId: string) => {
        state.nested(networkId).set(none);
    }
}

const getters : INetworkGetters = {
    isMainnet: () => {
        const currentNetworkId = getStore('Setting').state.currentNetworkId.get();
        const currentNetwork = DEFAULT_NETWORKS[currentNetworkId];
        return currentNetwork.chainId === MAINNET;
    },
    getNetworkByChainId: (chainId: string) => {
        return state.nested(chainId).get({noproxy: true});
    }
}

export default {
    state,
    actions,
    getters
};