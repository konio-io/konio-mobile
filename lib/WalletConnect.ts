import { ImmutableObject } from "@hookstate/core";
import { UserStore } from "../stores";
import { WALLET_CONNECT_PROJECT_ID, WC_METHODS } from "./Constants";
import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import { Network } from "../types/store";

export const checkWCMethod = (method: string) : boolean => {
    if (Object.values(WC_METHODS).includes(method)) {
        return true;
    }

    return false;
}

export const checkWCNetwork = (chainId: string) => {
    const currentNetworkId = UserStore.currentNetworkId.get();
    return currentNetworkId.includes(chainId.replace('koinos:',''));
}

export const initWCWallet = async () => {
    const core = new Core({
        projectId: WALLET_CONNECT_PROJECT_ID,
    });

    return await Web3Wallet.init({
        core,
        metadata: {
            name: "Web3Wallet React Native Tutorial",
            description: "ReactNative Web3Wallet",
            url: "https://walletconnect.com/",
            icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
    });
}

export const getNetworkByChainId = (chainId: string) : ImmutableObject<Network>|null => {
    for (const networkId in UserStore.networks.get()) {
        if (networkId.includes(chainId.replace('koinos:',''))) {
            return UserStore.networks[networkId].get();
        }
    }
    
    return null;
}