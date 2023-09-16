import { UserStore } from "../stores"

export const getCurrentAddress = () => {
    return UserStore.currentAddress.get();
}

export const getCurrentNetworkId = () => {
    return UserStore.currentNetworkId.get();
}

export const getAccount = (address: string) => {
    return UserStore.accounts[address];
}

export const getCoins = () => {
    const address = getCurrentAddress();
    const networkId = getCurrentNetworkId();
    const coins = UserStore.accounts[address]?.assets[networkId]?.coins.get();

    return coins ? Object.values(coins) : [];
}

export const getCoin = (props: {
    contractId: string
}) => {
    const address = getCurrentAddress();
    const networkId = getCurrentNetworkId();
    
    return UserStore.accounts[address]?.assets[networkId]?.coins[props.contractId].get();
}