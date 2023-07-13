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
        explorer: "https://koinosblocks.com",
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
    "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==": {
        name: "Koinos Harbinger (testnet)",
        chainId: "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==",
        rpcNodes: [
            "https://harbinger-api.koinos.io",
            "https://testnet.koinosblocks.com",
        ],
        explorer: "https://harbinger.koinosblocks.com",
        coins: {
            KOIN: {
                contractId: "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ",
                symbol: "KOIN",
                decimal: 8,
                networkId: "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==",
                transactions: []
            },
            VHP: {
                contractId: "1JZqj7dDrK5LzvdJgufYBJNUFo88xBoWC8",
                symbol: "VHP",
                decimal: 8,
                networkId: "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==",
                transactions: []
            },
            MANA: {
                contractId: "1BXi4SX4jjbaLzcRbmRKtpMQbQmFYnmX9Z",
                symbol: "MANA",
                decimal: 8,
                networkId: "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==",
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