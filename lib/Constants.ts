import { Network } from "../types/store";

export const MAINNET = "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==";
export const DEFAULT_NETWORK = "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==";
export const DEFAULT_NETWORKS: Record<string, Network> = {
    "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==": {
        id: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
        name: "Mainnet",
        chainId: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
        rpcNodes: [
            "https://api.koinos.io",
            "https://api.koinosblocks.com"
        ],
        koinContractId: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL"
    },
    "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==": {
        id: "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==",
        name: "Harbinger (testnet)",
        chainId: "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==",
        rpcNodes: [
            "https://harbinger-api.koinos.io",
            "https://testnet.koinosblocks.com",
        ],
        koinContractId: "1FaSvLjQJsCJKq5ybmGsMMQs8RQYyVv8ju"
    }
}

export const TRANSACTION_TYPE_WITHDRAW = 'WITHDRAW';
export const TRANSACTION_TYPE_DEPOSIT = 'DEPOSIT';
export const TRANSACTION_TYPE_SWAP = 'SWAP';
export const TRANSACTION_STATUS_PENDING = 'PENDING';
export const TRANSACTION_STATUS_SUCCESS = 'SUCCESS';
export const TRANSACTION_STATUS_ERROR = 'ERROR';
export const FALLBACK_LOCALE = 'en';
export const FALLBACK_THEME = 'light';
export const OS_LOCALE = 'auto';
export const OS_THEME = 'auto';
export const MAX_ACCOUNT = 10;
export const DONATION_ADDRESS = '1Pbh4S8iSXRJrsa4rm4DKSBr9QhbPA4Sxj';
export const UNIVERSAL_LINK_PREFIX = 'https://wallet.konio.io';
export const RESOURCES_DOMAIN = 'konio.io';
export const WALLET_CONNECT_PROJECT_ID = 'c0d8292ab97b4f7adb8f12f095d2806a';
export const BROWSER_SEARCH_URL = 'https://duckduckgo.com/?t=h_&q=';
export const BROWSER_HOME_URL = 'https://konio.io/browser';
export const TOKENS_URL = 'https://tokens.konio.io';
export const TERMS_URL = 'https://konio.io/terms/';
export const PRIVACY_URL = 'https://konio.io/privacy-policy/';
export const FAQ_URL = 'https://konio.io/faq/';
export const WC_METHODS = {
    SIGN_MESSAGE: 'koinos_signMessage',
    SIGN_HASH: 'koinos_signHash',
    SIGN_TRANSACTION: 'koinos_signTransaction',
    SIGN_AND_SEND_TRANSACTION: 'koinos_signAndSendTransaction',
    PREPARE_TRANSACTION: 'koinos_prepareTransaction',
    WAIT_FOR_TRANSACTION: 'koinos_waitForTransaction',
    SEND_TRANSACTION: 'koinos_sendTransaction',
    READ_CONTRACT: 'koinos_readContract',
    JSON_RPC_CALL: 'koinos_JsonRpcCall',
    GET_NONCE: 'koinos_getNonce',
    GET_NEXT_NONCE: 'koinos_getNextNonce',
    GET_ACCOUNT_RC: 'koinos_getAccountRc',
    GET_TRANSACTIONS_BY_ID: 'koinos_getTransactionsById',
    GET_BLOCKS_BY_ID: 'koinos_getBlocksById',
    GET_HEAD_INFO: 'koinos_getHeadInfo',
    GET_CHAIN_ID: 'koinos_getChainId',
    GET_BLOCKS: 'koinos_getBlocks',
    GET_BLOCK: 'koinos_getBlock',
    SUBMIT_BLOCK: 'koinos_submitBlock'
}
export const WC_SECURE_METHODS = [
    WC_METHODS.SIGN_MESSAGE,
    WC_METHODS.SIGN_TRANSACTION,
    WC_METHODS.SEND_TRANSACTION,
    WC_METHODS.SIGN_AND_SEND_TRANSACTION
];
export const KAP_NAMESERVICE_CID = "13tmzDmfqCsbYT26C4CmKxq86d33senqH3";
export const KAP_PROFILE_CID = "1EttfMuvTXGh8oE6vLiRF5JfqBvRiofFkB";
export const KAP_PREFIX = "kap://";
export const NIC_NAMESERVICE_CID = "1KD9Es7LBBjA1FY3ViCgQJ7e6WH1ipKbhz";
export const NIC_PREFIX = '@';
export const CATEGORY_COINS = 'coins';
export const CATEGORY_NFTS = 'nfts';
export const DEFAULT_IPFS_GATEWAY = 'https://${ipfsHash}.ipfs.nftstorage.link';