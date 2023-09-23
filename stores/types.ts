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
    rcLimit: string,
    version: string,
    logs: Array<string>,
    locale: string,
    theme: string,
    biometric: boolean,
    autolock: number,
    askReview: boolean
}

export interface SettingActions {
    setCurrentAccount(address: string): void;
    setCurrentNetwork(networkId: string): void;
    setLocale(locale: string): void;
    setTheme(theme: string): void;
    setBiometric(value: boolean): void;
    setAutolock(autolock: number): void;
    showAskReview(): Promise<void>;
    setRcLimit(value: string): void;
    logError(text: string): void;
    logReset(): void;
}

export interface SettingStore {
    state: State<SettingState>;
    actions: SettingActions
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

export interface SecureActions {
    setPassword: (password: string) => void;
    checkPassword: (password: string) => boolean;
    getSeedAccountId: () => string | undefined;
    deIncrementIndex: () => void;
    incrementIndex: () => void;
    deleteAccount: (id: string) => void;
    addAccount: (account: AccountSecure) => void;
}

export interface SecureStore {
    state: State<SecureState>;
    actions: SecureActions
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

export interface AccountActions {
    addAddress(accountId: string, name: string): void;
    addSeed(args: { seed: string; name: string }): Promise<string>;
    importAccount(args: { privateKey: string; name: string }): Promise<string>;
    addAccount(name: string): Promise<string>;
    deleteAccount(id: string): void;
    setAccountName(address: string, name: string): void;
}

export interface AccountStore {
    state: State<AccountState>;
    actions: AccountActions
}

/**
 * Contact
 */
export type Contact = {
    name: string,
    address: string
}

export type ContactState = Record<string, Contact>

export interface ContactActions {
    addContact: (item: Contact) => void;
    deleteContact: (address: string) => void;
}

export interface ContactGetters {
    getContact: (search: string) => object | undefined;
}

export interface ContactStore {
    state: State<ContactState>;
    actions: ContactActions;
    getters: ContactGetters;
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

export interface CoinGetters {
    getCoins: () => Array<Coin>;
    getCoin: (contractId: string) => Coin|undefined;
    coinId: (accountId: string, networkId: string, contractId: string) => string;
    fetchContractInfo: (contractId: string) => Promise<any>;
    fetchCoinPrice: (contractId: string) => Promise<number | null>;
    fetchCoinBalance: (contractId: string) => Promise<number | null>;
    fetchCoinContract: (contractId: string) => Promise<any>;
}

export interface CoinActions {
    withdrawCoin: (args: {
        contractId: string;
        to: string;
        value: string;
        note: string;
    }) => Promise<Transaction>;
    addCoin: (contractId: string) => Promise<Coin>;
    withdrawCoinConfirm: (args: {
        contractId: string;
        transaction: TransactionJsonWait;
    }) => Promise<Transaction>;
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

export interface CoinStore {
    state: State<CoinState>;
    actions: CoinActions,
    getters: CoinGetters
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

export interface NftCollectionActions {
    addNftCollection: (contractId: string) => Promise<NftCollection>;
    deleteNftCollection: (id: string) => void;
}

export interface NftCollectionGetters {
    getNftContract: (contractId: string) => Promise<any>;
    nftCollectionId: (accountId: string, networkId: string, contractId: string) => string;
}

export interface NftCollectionStore {
    state: State<NftCollectionState>;
    actions: NftCollectionActions;
    getters: NftCollectionGetters;
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

export interface NftActions {
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

export interface NftGetters {
    fetchNft: (args: {
        uri: string;
        tokenId: string;
    }) => Promise<any>;
    nftId: (accountId: string, networkId: string, contractId: string, tokenId: string) => string;
}

export interface NftStore {
    state: State<NftState>;
    actions: NftActions;
    getters: NftGetters;
}

/**
 * Network
 */
export type Network = {
    id: string,
    name: string,
    chainId: string,
    rpcNodes: Array<string>,
    explorer: string,
    koinContractId: string
}

export type NetworkState = Record<string, Network>

export interface NetworkActions {
    addNetwork: (network: Network) => void;
    deleteNetwork: (networkId: string) => void;
}

export interface NetworkGetters {
    isMainnet: () => boolean
}

export interface NetworkStore {
    state: State<NetworkState>;
    actions: NetworkActions,
    getters: NetworkGetters
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
    value: string,
    timestamp: string,
    blockNumber?: number
    status: "PENDING" | "SUCCESS" | "ERROR",
    note?: string
}

/**
 * Kap
 */
export type KapState = Record<string, string>

export interface KapActions {
    refreshKap: (search: string) => Promise<void>;
}

export interface KapGetters {
    getKapAddressByName: (name: string) => Promise<string | undefined>;
    getKapProfileByAddress: (address: string) => Promise<any | undefined>;
}

export interface KapStore {
    state: State<KapState>;
    actions: KapActions,
    getters: KapGetters
}

/**
 * Mana
 */
export type ManaState = {
    mana: number,
    lastUpdateMana: number
}

export interface ManaActions {
    refreshMana: () => Promise<void>;
}

export interface ManaStore {
    state: State<ManaState>;
    actions: ManaActions
}

/**
 * WalletConnect
 */
export type WalletConnectState = {
    wallet: IWeb3Wallet | null,
    activeSessions: Record<string, SessionTypes.Struct>,
    pendingProposal: SignClientTypes.EventArguments["session_proposal"] | null,
    pendingRequest: SignClientTypes.EventArguments["session_request"] | null
    uri: string | null
}

export interface WalletConnectActions {
    init: () => Promise<void>;
    setUri: (uri: string) => void;
    pair: (CURI: string) => Promise<void>;
    acceptProposal: (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => Promise<void>;
    rejectProposal: (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => Promise<void>;
    acceptRequest: (sessionRequest: SignClientTypes.EventArguments["session_request"]) => Promise<void>;
    rejectRequest: (sessionRequest: SignClientTypes.EventArguments["session_request"]) => Promise<void>;
    refreshActiveSessions: () => void;
    setPendingProposal: (proposal: SignClientTypes.EventArguments["session_proposal"]) => void;
    unsetPendingProposal: () => void;
    setPendingRequest: (request: SignClientTypes.EventArguments["session_request"]) => void;
    unsetPendingRequest: () => void;
    checkMethod: (method: string) => boolean;
    checkNetwork: (chainId: string) => boolean;
}

export interface WalletConnectStore {
    state: State<WalletConnectState>;
    actions: WalletConnectActions
}

/**
 * Spinner
 */
export type SpinnerState = boolean;

export interface SpinnerActions {
    showSpinner: () => void;
    hideSpinner: () => void;
}

export interface SpinnerStore {
    state: State<SpinnerState>;
    actions: SpinnerActions
}

/**
 * Lock
 */
export type LockState = boolean;

export interface LockActions {
    lock: () => void,
    unlock: () => void
}

export interface LockStore {
    state: State<LockState>,
    actions: LockActions
}

/**
 * Koin
 */
export interface KoinActions {
    signHash: (signer: Signer, hash: string) => Promise<string>;
    signMessage: (signer: Signer, message: string) => Promise<string>;
    prepareTransaction: (signer: Signer, tx: TransactionJson) => Promise<TransactionJson>;
    signTransaction: (signer: Signer, tx: TransactionJson, abis?: Record<string, Abi>) => Promise<TransactionJson>;
    sendTransaction: (signer: Signer, tx: TransactionJson, options?: SendTransactionOptions) => Promise<{
        receipt: TransactionReceipt;
        transaction: TransactionJsonWait;
    }>;
    signAndSendTransaction: (signer: Signer, tx: TransactionJson, options?: SendTransactionOptions) => Promise<{
        receipt: TransactionReceipt;
        transaction: TransactionJsonWait;
    }>;
    waitForTransaction: (transactionId: string, type?: 'byTransactionId' | 'byBlock', timeout?: number) => Promise<{
        blockId: string;
        blockNumber?: number;
    }>;
}

export interface KoinGetters {
    fetchContract: (contractId: string) => Promise<Contract>;
    getProvider: () => Provider;
    getSigner: () => Signer;
}

export interface KoinStore {
    actions: KoinActions,
    getters: KoinGetters
}

export interface Store {
    Setting: SettingStore;
    Account: AccountStore;
    Network: NetworkStore;
    Secure: SecureStore;
    Contact: ContactStore;
    Coin: CoinStore;
    NftCollection: NftCollectionStore;
    Nft: NftStore;
    Spinner: SpinnerStore;
    Kap: KapStore;
    Mana: ManaStore;
    WalletConnect: WalletConnectStore;
    Koin: KoinStore;
    Lock: LockStore
}