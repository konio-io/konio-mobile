import { Network } from "../types/store";

export const DEFAULT_NETWORK = "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==";
export const DEFAULT_NETWORKS: Record<string, Network> = {
    "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==": {
        name: "Koinos Mainnet",
        chainId: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
        rpcNodes: ["https://api.koinos.io", "https://api.koinosblocks.com"],
        koinContractId: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
        explorer: "https://koinosblocks.com"
    },
    "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==": {
        name: "Koinos Harbinger (testnet)",
        chainId: "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==",
        rpcNodes: [
            "https://harbinger-api.koinos.io",
            "https://testnet.koinosblocks.com",
        ],
        koinContractId: "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ",
        explorer: "https://harbinger.koinosblocks.com"
    }
}
export const DEFAULT_COINS = {
    "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL": {
        contractId: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
        symbol: "KOIN",
        decimal: 8,
        networkId: "EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==",
        transactions: []
    },
    "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ": {
        contractId: "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ",
        symbol: "KOIN",
        decimal: 8,
        networkId: "EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==",
        transactions: []
    }
}
export const TRANSACTION_TYPE_WITHDRAW = 'WITHDRAW';
export const TRANSACTION_TYPE_DEPOSIT = 'DEPOSIT';
export const TRANSACTION_TYPE_SWAP = 'SWAP';
export const TRANSACTION_STATUS_PENDING = 'PENDING';
export const TRANSACTION_STATUS_SUCCESS = 'SUCCESS';
export const TRANSACTION_STATUS_ERROR = 'ERROR';