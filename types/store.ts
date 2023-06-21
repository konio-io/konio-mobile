import { StatusBarStyle } from "expo-status-bar"

export type EncryptedStoreState = {
    accounts: Record<string, Account>,
    password: string
}

export type UserStoreState = {
    currentNetworkId: string,
    currentAddress: string|null,
    wallets: Record<string, Wallet>,
    coins: Record<string, Coin>,
    transactions: Record<string, Transaction>,
    networks: Record<string, Network>,
    locale: string,
    theme: string,
    biometric: boolean
}

export type Account = {
    address: string,
    privateKey: string,
    seed?: string,
    accountIndex?: number
}

export type Wallet = {
    name: string,
    address: string,
    coins: Array<string>
}

export type Coin = {
    contractId: string,
    symbol: string,
    decimal: number,
    networkId: string,
    transactions: Array<string>
}

export type Network = {
    name: string,
    chainId: string,
    rpcNodes: Array<string>,
    koinContractId: string,
    explorer: string
}

export type Transaction = {
    transactionId: string,
    contractId: string,
    from: string,
    to: string,
    value: string,
    timestamp: string,
    type: "WITHDRAW"|"DEPOSIT"|"SWAP",
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
        large: number
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

export type Withdraw = {
    contractId: string,
    amount: number,
    address?: string
};