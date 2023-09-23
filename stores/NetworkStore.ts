import { hookstate, none } from "@hookstate/core";
import { Network, NetworkActions, NetworkGetters, NetworkState, NetworkStore, Store } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";
import { DEFAULT_NETWORKS, MAINNET } from "../lib/Constants";

export const NetworkStoreLoaded = hookstate(false);

const state = hookstate<NetworkState>(
    {}, 
    localstored({
        key: 'network',
        engine: AsyncStorage,
        loaded: NetworkStoreLoaded
    })
)

export const useNetworkStore = (store: () => Store): NetworkStore => {

    const actions : NetworkActions = {
        addNetwork: (network: Network) => {
            state.networks.merge({
                [network.chainId]: network
            });
        },
        
        deleteNetwork: (networkId: string) => {
            state.nested(networkId).set(none);
        }
    }

    const getters : NetworkGetters = {
        isMainnet: () => {
            const currentNetworkId = store().Setting.state.currentNetworkId.get();
            const currentNetwork = DEFAULT_NETWORKS[currentNetworkId];
            return currentNetwork.chainId === MAINNET;
        }
    }

    return {
        state,
        actions,
        getters
    };
    
}



