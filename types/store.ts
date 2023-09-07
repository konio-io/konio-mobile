import { StatusBarStyle } from "expo-status-bar"
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { IWeb3Wallet } from "@walletconnect/web3wallet";

export type EncryptedStoreState = {
    accounts: Record<string, AccountSecure>,
    password: string
}

export type UserStoreState = {
    currentNetworkId: string,
    currentAddress: string|null,
    accounts: Record<string, Account>,
    //coins: Record<string, Coin>,
    //nfts: Record<string, NFT>,
    //transactions: Record<string, Transaction>,
    networks: Record<string, Network>,
    locale: string,
    theme: string,
    biometric: boolean,
    autolock: number,
    addressbook: Record<string,Contact>,
    rcLimit: string,
    version: string,
    logs: Array<string>
}

export type AccountSecure = {
    address: string,
    privateKey: string,
    seed?: string,
    accountIndex?: number
}

export type Account = {
    name: string,
    address: string,
    assets: Record<string,Assets>
}

export type Assets = {
    coins: Record<string, Coin>,
    nfts: Record<string, NFT>
}

export type Coin = {
    contractId: string,
    symbol: string,
    decimal: number,
    name?: string,
    balance?: number,
    price?: number,
    logo?: string,
    transactions: Record<string, Transaction>,
}

export type NFT = {
    contractId: string,
    tokenId: string,
    image: string,
    name: string,
    description?: string,
    transactions: Record<string, Transaction>,
}

export type Network = {
    name: string,
    chainId: string,
    rpcNodes: Array<string>,
    explorer: string,
    koinContractId: string
}

export type Transaction = {
    transactionId: string,
    contractId: string,
    from: string,
    to: string,
    value: string,
    timestamp: string,
    blockNumber? : number
    status: "PENDING"|"SUCCESS"|"ERROR",
    note?: string
}

export type ThemeVars = {
    Spacing: {
        mini: number,
        small: number,
        base: number,
        medium: number,
        large: number
    },
    FontSize: {
        base: number,
        small: number,
        medium: number,
        large: number,
        xlarge: number
    },
    FontFamily: {
        sans: string
    },
    Color: {
        base: string
        baseContrast: string
        primary: string
        primaryContrast: string
        error: string
        warning: string
        success: string,
        secondary: string
    },
    Border: {
        color: string,
        width: number,
        radius: number
    }
}

export type Theme = {
    name: string,
    vars: ThemeVars,
    styles: any,
    statusBarStyle: StatusBarStyle
}

export type Contact = {
    name: string,
    address: string
}

export interface Dapp {
    icon: string,
    name: string,
    summary: string,
    description: string,
    url: string,
    tags: Array<string>,
    compatible: boolean
}

export type WCStoreState = {
    wallet: IWeb3Wallet|null,
    activeSessions: Record<string, SessionTypes.Struct>,
    pendingProposal: SignClientTypes.EventArguments["session_proposal"]|null,
    pendingRequest: SignClientTypes.EventArguments["session_request"]|null
}