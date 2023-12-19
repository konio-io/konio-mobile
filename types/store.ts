import { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { IWeb3Wallet } from "@walletconnect/web3wallet";
import { State } from "@hookstate/core";
import { Abi, OperationJson, SendTransactionOptions, TransactionJson, TransactionJsonWait, TransactionReceipt } from "koilib/lib/interface";
import { Contract, Provider, Signer } from "koilib";

/**
 * Setting
 */
export type SettingState = {
    currentNetworkId: string,
    currentAccountId: string,
    maxMana: number,
    version: string,
    locale: string,
    theme: string,
    biometric: boolean,
    autolock: number,
    askReview: boolean
}

export interface ISettingActions {
    setCurrentAccount(accountId: string): void;
    setCurrentNetwork(networkId: string): void;
    setLocale(locale: string): void;
    setTheme(theme: string): void;
    setBiometric(value: boolean): void;
    setAutolock(autolock: number): void;
    showAskReview(): Promise<void>;
    setMaxMana(value: number): void;
}

export interface ISettingStore {
    state: State<SettingState>;
    actions: ISettingActions
}

/**
 * Log
 */
export type LogState = Array<string>;

export interface ILogActions {
    logError(text: string): void;
    logReset(): void;
}

export interface ILogStore {
    state: State<LogState>;
    actions: ILogActions
}

/**
 * Account Secure
 */
export type AccountSecure = {
    id: string,
    address: string,
    privateKey: string,
    seed?: string,
    accountIndex?: number
}

export type SecureState = {
    accounts: Record<string, AccountSecure>,
    password: string
}

export interface ISecureActions {
    setPassword: (password: string) => void;
    deIncrementIndex: () => void;
    incrementIndex: () => void;
    deleteAccount: (id: string) => void;
    addAccount: (account: AccountSecure) => void;
}

export interface ISecureGetters {
    getSeedAccountId: () => string | undefined;
    getSeed: () => string | undefined;
    checkPassword: (password: string) => boolean;
}

export interface ISecureStore {
    state: State<SecureState>;
    actions: ISecureActions;
    getters: ISecureGetters;
}

/**
 * Account
 */
export type Account = {
    id: string,
    name: string,
    address: string
}

export type AccountState = Record<string, Account>

export interface IAccountActions {
    addAddress(accountId: string, name: string): void;
    addSeed(args: { seed: string; name: string }): Promise<string>;
    importAccount: (args: { privateKey: string; name: string }) => Promise<string>;
    addAccount(name: string): Promise<string>;
    deleteAccount(id: string): void;
    setAccountName(address: string, name: string): void;
}

export interface IAccountStore {
    state: State<AccountState>;
    actions: IAccountActions
}

/**
 * Contact
 */
export type Contact = {
    name: string,
    address: string
}

export type ContactState = Record<string, Contact>

export interface IContactActions {
    addContact: (item: Contact) => void;
    deleteContact: (address: string) => void;
}

export interface IContactStore {
    state: State<ContactState>;
    actions: IContactActions;
}

/**
 * Coin
 */
export type Coin = {
    id: string,
    contractId: string,
    networkId: string,
    accountId: string,
    symbol: string,
    decimal: number,
    name?: string,
    balance?: number,
    price?: number,
    logo?: string
}

export type CoinState = Record<string, Coin>

export interface ICoinGetters {
    getCoins: () => Array<Coin>;
    coinId: (accountId: string, networkId: string, contractId: string) => string;
    fetchContractInfo: (contractId: string) => Promise<any>;
    fetchCoinPrice: (contractId: string) => Promise<number | null>;
    fetchCoinBalance: (contractId: string) => Promise<number | null>;
    fetchCoinContract: (contractId: string) => Promise<any>;
}

export interface ICoinActions {
    withdrawCoin: (args: {
        id: string;
        to: string;
        value: string;
        note: string;
    }) => Promise<TransactionJsonWait|undefined>;
    addCoin: (contractId: string) => Promise<Coin>;
    withdrawCoinConfirm: (args: {
        id: string;
        transaction: TransactionJsonWait;
    }) => Promise<Transaction|undefined>;
    deleteCoin: (id: string) => void;
    refreshCoins: (args?: {
        contract?: boolean;
        info?: boolean;
        balance?: boolean;
        price?: boolean;
    }) => Promise<void[]>;
    refreshCoin: (args: {
        id: string;
        contract?: boolean;
        info?: boolean;
        balance?: boolean;
        price?: boolean;
    }) => Promise<any>;
    refreshCoinContract: (id: string) => Promise<void>;
    refreshCoinBalance: (id: string) => Promise<void>;
    refreshCoinInfo: (id: string) => Promise<void>;
    refreshCoinPrice: (id: string) => Promise<void>;
}

export interface ICoinStore {
    state: State<CoinState>;
    actions: ICoinActions,
    getters: ICoinGetters
}


/**
 * Nft Collection
 */
export type NftCollection = {
    id: string,
    contractId: string,
    networkId: string,
    accountId: string,
    symbol: string,
    name?: string,
    uri: string,
    owner: string
}

export type NftCollectionState = Record<string, NftCollection>

export interface INftCollectionActions {
    addNftCollection: (contractId: string) => Promise<NftCollection>;
    deleteNftCollection: (id: string) => void;
}

export interface INftCollectionGetters {
    getNftContract: (contractId: string) => Promise<any>;
    nftCollectionId: (accountId: string, networkId: string, contractId: string) => string;
}

export interface INftCollectionStore {
    state: State<NftCollectionState>;
    actions: INftCollectionActions;
    getters: INftCollectionGetters;
}

/**
 * Nft
 */
export type Nft = {
    id: string,
    networkId: string,
    accountId: string,
    contractId: string,
    tokenId: string,
    nftCollectionId: string,
    image: string,
    description?: string
}

export type NftState = Record<string, Nft>

export interface INftActions {
    addNft: (args: {
        contractId: string;
        tokenId: string;
    }) => Promise<Nft>;
    deleteNft: (id: string) => void;
    withdrawNft: (args: {
        id: string;
        to: string;
    }) => Promise<{
        operation: OperationJson;
        transaction?: TransactionJsonWait | undefined;
        result?: Record<string, any> | undefined;
        receipt?: TransactionReceipt | undefined;
    }>;
    withdrawNftConfirm: (id: string) => Promise<boolean>;
}

export interface INftGetters {
    fetchNft: (args: {
        uri: string;
        tokenId: string;
    }) => Promise<any>;
    nftId: (accountId: string, networkId: string, contractId: string, tokenId: string) => string;
}

export interface INftStore {
    state: State<NftState>;
    actions: INftActions;
    getters: INftGetters;
}

/**
 * Network
 */
export type Network = {
    id: string,
    name: string,
    chainId: string,
    rpcNodes: Array<string>,
    koinContractId: string
}

export type NetworkState = Record<string, Network>

export interface INetworkActions {
    addNetwork: (network: Network) => void;
    deleteNetwork: (networkId: string) => void;
}

export interface INetworkGetters {
    isMainnet: () => boolean,
    getNetworkByChainId: (chainId: string) => Network|undefined
}

export interface INetworkStore {
    state: State<NetworkState>;
    actions: INetworkActions,
    getters: INetworkGetters
}

/**
 * Transaction
 */
export type Transaction = {
    id: string,
    transactionId: string,
    networkId: string,
    contractId: string,
    from: string,
    to: string,
    value?: string,
    tokenId?: string,
    timestamp?: number,
    status: "PENDING" | "SUCCESS" | "ERROR"
}

export type TransactionState = Record<string, Transaction>

export interface ITransactionActions {
    addTransaction: (Transaction: Transaction) => void;
    updateTransaction: (transactionId: string, data: any) => void;
    refreshTransactions: (coinId: string) => Promise<void>;
}

export interface ITransactionGetters {
    getTransactionHistory: (args: {
        coinId: string, 
        seqNum?: number, 
        limit?: number, 
        ascending?: boolean,
        cb?: Function
    }) => Promise<Array<Transaction>>;
}

export interface ITransactionStore {
    state: State<TransactionState>;
    actions: ITransactionActions,
    getters: ITransactionGetters
}

/**
 * Kap
 */
export type NameserverState = Record<string, string>

export interface INameserverActions {
    add: (address: string, ns: string) => void;
}

export interface INameserverGetters {
    getAddress: (query: string) => Promise<string | undefined>;
    validateKapQuery: (query: string) => string|null;
    validateNicQuery: (query: string) => string|null;
    getNicAddressByName: (name: string) => Promise<string | undefined>;
    getNicNameByAddress: (address: string) => Promise<any | undefined>;
    getKapAddressByName: (name: string) => Promise<string | undefined>;
    getKapProfileByAddress: (address: string) => Promise<any | undefined>;
}

export interface INameserverStore {
    state: State<NameserverState>;
    actions: INameserverActions,
    getters: INameserverGetters
}

/**
 * Payer
 */
export type Payer = {
    id: string
    address: string
    networkId: string
    name: string
}

export type PayerState = Record<string, Payer>

export interface IPayerGetters {
    getCurrentPayers: () => Array<Payer>;
}

export interface IPayerActions {
    refreshPayers: () => void;
}

export interface IPayerStore {
    state: State<PayerState>;
    actions: IPayerActions,
    getters: IPayerGetters
}


/**
 * Mana
 */
export type ManaState = {
    mana: number,
    maxMana: number,
    payer: string,
    lastUpdateMana: number
}

export interface IManaActions {
    refreshMana: () => Promise<void>;
    setMaxMana: (value: number) => void;
    setPayer: (payerId: string) => void;
}

export interface IManaGetters {
    getRcLimit: () => number
}

export interface IManaStore {
    state: State<ManaState>;
    actions: IManaActions,
    getters: IManaGetters
}

/**
 * WalletConnect
 */
export type WalletConnectState = {
    wallet: IWeb3Wallet | null,
    activeSessions: Record<string, SessionTypes.Struct>,
    uri: string | null
}

export interface IWalletConnectActions {
    init: () => Promise<void>;
    setUri: (uri: string) => void;
    pair: (CURI: string) => Promise<void>;
    acceptProposal: (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => Promise<void>;
    rejectProposal: (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => Promise<void>;
    acceptRequest: (sessionRequest: SignClientTypes.EventArguments["session_request"]) => Promise<void>;
    rejectRequest: (sessionRequest: SignClientTypes.EventArguments["session_request"]) => Promise<void>;
    refreshActiveSessions: () => void;
}

export interface IWalletConnectGetters {
    checkMethod: (method: string) => boolean;
    checkNetwork: (chainId: string) => boolean;
}

export interface IWalletConnectStore {
    state: State<WalletConnectState>;
    actions: IWalletConnectActions;
    getters: IWalletConnectGetters;
}

/**
 * Spinner
 */
export type SpinnerState = boolean;

export interface ISpinnerActions {
    showSpinner: () => void;
    hideSpinner: () => void;
}

export interface ISpinnerStore {
    state: State<SpinnerState>;
    actions: ISpinnerActions
}

/**
 * Lock
 */
export type LockState = boolean;

export interface ILockActions {
    lock: () => void,
    unlock: () => void
}

export interface ILockStore {
    state: State<LockState>,
    actions: ILockActions
}

/**
 * Koin
 */
export interface IKoinActions {
    signHash: (hash: string) => Promise<string>;
    signMessage: (message: string) => Promise<string>;
    prepareTransaction: (tx: TransactionJson) => Promise<TransactionJson>;
    signTransaction: (tx: TransactionJson, abis?: Record<string, Abi>) => Promise<TransactionJson>;
    sendTransaction: (tx: TransactionJson, options?: SendTransactionOptions) => Promise<{
        receipt: TransactionReceipt;
        transaction: TransactionJsonWait;
    }>;
    signAndSendTransaction: (tx: TransactionJson, options?: SendTransactionOptions) => Promise<{
        receipt: TransactionReceipt;
        transaction: TransactionJsonWait;
    }>;
    waitForTransaction: (transactionId: string, type?: 'byTransactionId' | 'byBlock', timeout?: number) => Promise<{
        blockId: string;
        blockNumber?: number;
    }>;
}

export interface IKoinGetters {
    fetchContract: (contractId: string) => Promise<Contract>;
    getProvider: () => Provider;
    getSigner: () => Signer;
}

export interface IKoinStore {
    actions: IKoinActions,
    getters: IKoinGetters
}

export type StoreRegistry = {
    Setting: ISettingStore;
    Account: IAccountStore;
    Network: INetworkStore;
    Secure: ISecureStore;
    Contact: IContactStore;
    Coin: ICoinStore;
    NftCollection: INftCollectionStore;
    Nft: INftStore;
    Spinner: ISpinnerStore;
    Nameserver: INameserverStore;
    Mana: IManaStore;
    WalletConnect: IWalletConnectStore;
    Koin: IKoinStore;
    Lock: ILockStore;
    Log: ILogStore;
    Transaction: ITransactionStore;
};