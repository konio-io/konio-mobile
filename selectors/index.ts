import { KapStore, UserStore } from "../stores";

export const selectCurrentAddress = () => {
    return UserStore.currentAddress;
}
export const selectCurrentNetworkId = () => {
    return UserStore.currentNetworkId;
}

export const selectNetworks = () => {
    return UserStore.networks;
}

export const selectNetwork = (networkId: string) => {
    return UserStore.networks
        .nested(networkId);
}

export const selectAccounts = () => {
    return UserStore.accounts;
}

export const selectAccount = (address: string) => {
    return UserStore.accounts
        .nested(address);
}

export const selectCoins = (args: {
    address: string,
    networkId: string
}) => {
    return UserStore.accounts
        ?.nested(args.address)
        ?.assets
        ?.nested(args.networkId)
        ?.coins;
}

export const selectCoin = (args: {
    address: string,
    networkId: string,
    contractId: string
}) => {
    return UserStore.accounts
        ?.nested(args.address)
        ?.assets
        ?.nested(args.networkId)
        ?.coins
        ?.nested(args.contractId);
}

export const selectCoinTransactions = (args: {
    address: string,
    networkId: string,
    contractId: string
}) => {
    return UserStore.accounts
        ?.nested(args.address)
        ?.assets
        ?.nested(args.networkId)
        ?.coins
        ?.nested(args.contractId)
        ?.transactions;
}

export const selectCoinTransaction = (args: {
    address: string,
    networkId: string,
    contractId: string,
    transactionId: string
}) => {
    return UserStore.accounts
        ?.nested(args.address)
        ?.assets
        ?.nested(args.networkId)
        ?.coins
        ?.nested(args.contractId)
        ?.transactions
        ?.nested(args.transactionId);
}

export const selectNfts = (args: {
    address: string,
    networkId: string
}) => {
    return UserStore.accounts
        ?.nested(args.address)
        ?.assets
        ?.nested(args.networkId)
        ?.nfts;
}

export const selectNftCollection = (args: {
    address: string,
    networkId: string,
    contractId: string
}) => {
    return UserStore.accounts
        ?.nested(args.address)
        ?.assets
        ?.nested(args.networkId)
        ?.nfts
        ?.nested(args.contractId);
}

export const selectNft = (args: {
    address: string,
    networkId: string,
    contractId: string,
    tokenId: string
}) => {
    return UserStore.accounts
        ?.nested(args.address)
        ?.assets
        ?.nested(args.networkId)
        ?.nfts
        ?.nested(args.contractId)
        ?.tokens
        ?.nested(args.tokenId);
}

export const selectAddressBook = () => {
    return UserStore.addressbook;
}

export const selectContact = (address: string) => {
    return UserStore.addressbook?.nested(address);
}

export const selectKap = (address: string) => {
    return KapStore.nested(address)
}