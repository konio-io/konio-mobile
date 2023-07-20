import { Network } from "../types/store";

export const DEFAULT_NETWORK = "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==";
export const DEFAULT_NETWORKS: Record<string, Network> = {
    "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==": {
        name: "Koinos Mainnet",
        chainId: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
        rpcNodes: [
            "https://api.koinos.io",
            "https://api.koinosblocks.com"
        ],
        explorer: "https://koiner.app/transactions",
        coins: {
            KOIN: {
                contractId: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
                symbol: "KOIN",
                decimal: 8,
                networkId: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
                transactions: []
            },
            VHP: {
                contractId: "18tWNU7E4yuQzz7hMVpceb9ixmaWLVyQsr",
                symbol: "VHP",
                decimal: 8,
                networkId: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
                transactions: []
            },
            MANA: {
                contractId: "1HGN9h47CzoFwU2bQZwe6BYoX4TM6pXc4b",
                symbol: "MANA",
                decimal: 8,
                networkId: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
                transactions: []
            }
        }
    },
    "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==": {
        name: "Koinos Harbinger (testnet)",
        chainId: "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==",
        rpcNodes: [
            "https://harbinger-api.koinos.io",
            "https://testnet.koinosblocks.com",
        ],
        explorer: "https://koiner.app/transactions",
        coins: {
            KOIN: {
                contractId: "1FaSvLjQJsCJKq5ybmGsMMQs8RQYyVv8ju",
                symbol: "KOIN",
                decimal: 8,
                networkId: "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==",
                transactions: []
            },
            VHP: {
                contractId: "17n12ktwN79sR6ia9DDgCfmw77EgpbTyBi",
                symbol: "VHP",
                decimal: 8,
                networkId: "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==",
                transactions: []
            },
            MANA: {
                contractId: "16X6cKyqiT8EzPEksRJxXcqMnHMMm9Vxct",
                symbol: "MANA",
                decimal: 8,
                networkId: "EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==",
                transactions: []
            }
        }
    }
}

export const DEFAULT_COINS = ['KOIN','VHP'];

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
export const DAPPS_URL = 'https://dapps.konio.io';
export const TOKENS_URL = 'https://tokens.konio.io';
export const WC_METHODS = {
    SIGN_MESSAGE: 'koinos_signMessage',
    SIGN_HASH: 'koinos_signHash',
    SIGN_TRANSACTION: 'koinos_signTransaction',
    SIGN_AND_SEND_TRANSACTION: 'koinos_signAndSendTransaction',
    PREPARE_TRANSACTION: 'koinos_prepareTransaction',
    WAIT_FOR_TRANSACTION: 'koinos_waitForTransaction',
    SEND_TRANSACTION: 'koinos_sendTransaction'
}
export const WC_SECURE_METHODS = [
    WC_METHODS.SIGN_MESSAGE,
    WC_METHODS.SIGN_TRANSACTION,
    WC_METHODS.SEND_TRANSACTION,
    WC_METHODS.SIGN_AND_SEND_TRANSACTION
]