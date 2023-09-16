import { UserStore } from "../stores"

export const getAccount = (address: string) => {
    return UserStore.accounts[address];
}

export const getCoins = (props: {
    address: string, 
    networkId: string
}) => {
    return UserStore
        .accounts[props.address]
        .assets[props.networkId]
        .coins;
}

export const getCoin = (props: {
    address: string,
    networkId: string,
    contractId: string
}) => {
    return UserStore
        .accounts[props.address]
        .assets[props.networkId]
        .coins[props.contractId];
}