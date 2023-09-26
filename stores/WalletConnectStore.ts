import { hookstate, none } from "@hookstate/core";
import { WALLET_CONNECT_PROJECT_ID, WC_METHODS } from "../lib/Constants";
import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import { formatJsonRpcResult, formatJsonRpcError } from "@json-rpc-tools/utils";
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { IWalletConnectActions, IWalletConnectGetters, WalletConnectState } from "../types/store";
import { getStore } from "./registry";

const state = hookstate<WalletConnectState>({
    wallet: null,
    activeSessions: {},
    pendingProposal: null,
    pendingRequest: null,
    uri: null
});

const actions : IWalletConnectActions = {
    init: async () => {
        const core = new Core({
            projectId: WALLET_CONNECT_PROJECT_ID,
        });
    
        const wallet = await Web3Wallet.init({
            core,
            metadata: {
                name: "Web3Wallet React Native Tutorial",
                description: "ReactNative Web3Wallet",
                url: "https://walletconnect.com/",
                icons: ["https://avatars.githubusercontent.com/u/37784886"],
            },
        });

        state.wallet.set(wallet);
    },
    
    setUri: (uri: string) => {
        state.uri.set(uri);
    },
    
    pair: async (CURI: string) => {
        const wallet = state.wallet.get();
        if (wallet) {
            await wallet.core.pairing.pair({ uri: CURI });
        }
    },
    
    acceptProposal: async (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => {
        const wallet = state.wallet.get();
        if (!wallet) {
            throw new Error("WalletConnect wallet not initialized");
        }
    
        const currentAccountId = getStore('Setting').state.currentAccountId.get();
        const currentAddress = getStore('Account').state.nested(currentAccountId).address.get();
    
        const { id, params } = sessionProposal;
        const { requiredNamespaces, relays } = params;
        const namespaces: SessionTypes.Namespaces = {};
    
        for (const key in requiredNamespaces) {
            const accounts: string[] = [];
            requiredNamespaces[key].chains?.map((chain: string) => {
                [currentAddress].map((acc) => accounts.push(`${chain}:${acc}`));
            });
    
            namespaces[key] = {
                accounts,
                chains: requiredNamespaces[key].chains,
                methods: requiredNamespaces[key].methods,
                events: requiredNamespaces[key].events,
            };
        }
    
        await wallet.approveSession({
            id,
            relayProtocol: relays[0].protocol,
            namespaces,
        });
        
        actions.refreshActiveSessions();
    },
    
    rejectProposal: async (sessionProposal: SignClientTypes.EventArguments["session_proposal"]) => {
        const wallet = state.wallet.get();
        if (!wallet) {
            throw new Error("W3 Wallet not available");
        }
    
        const { id } = sessionProposal;
        await wallet.rejectSession({
            id,
            reason: getSdkError("USER_REJECTED_METHODS"),
        });
    },
    
    acceptRequest: async (sessionRequest: SignClientTypes.EventArguments["session_request"]) => {
        const wallet = state.wallet.get();
        if (!wallet) {
            throw new Error("W3 Wallet not available");
        }
    
        const { params, id, topic } = sessionRequest;
        const { request } = params;
        const signer = getStore('Koin').getters.getSigner();
        let result: any = null;
        const provider = signer.provider;
    
        switch (request.method) {
            case WC_METHODS.SIGN_MESSAGE:
                result = await getStore('Koin').actions.signMessage(signer, request.params.message);
                break;
            case WC_METHODS.SIGN_HASH:
                result = await getStore('Koin').actions.signHash(signer, request.params.hash);
                break;
            case WC_METHODS.PREPARE_TRANSACTION:
                result = await getStore('Koin').actions.prepareTransaction(signer, request.params.transaction);
                break;
            case WC_METHODS.SIGN_TRANSACTION:
                result = await getStore('Koin').actions.signTransaction(signer, request.params.transaction, request.params.options?.abis);
                break;
            case WC_METHODS.SEND_TRANSACTION:
                result = await getStore('Koin').actions.sendTransaction(signer, request.params.transaction, request.params.options);
                break;
            case WC_METHODS.SIGN_AND_SEND_TRANSACTION:
                result = await getStore('Koin').actions.signAndSendTransaction(signer, request.params.transaction, request.params.options);
                break;
            case WC_METHODS.WAIT_FOR_TRANSACTION:
                result = await getStore('Koin').actions.waitForTransaction(request.params.transactionId, request.params.type, request.params.timeout);
                getStore('Mana').actions.refreshMana();
                getStore('Coin').actions.refreshCoins({balance: true});
                break;
            case WC_METHODS.READ_CONTRACT:
                result = await provider?.readContract(request.params.operation);
                break;
            case WC_METHODS.JSON_RPC_CALL:
                result = await provider?.call(request.params.method, request.params.params);
                break;
            case WC_METHODS.GET_NONCE:
                result = await provider?.getNonce(request.params.address);
                break;
            case WC_METHODS.GET_NEXT_NONCE:
                result = await provider?.getNextNonce(request.params.address);
                break;
            case WC_METHODS.GET_ACCOUNT_RC:
                result = await provider?.getAccountRc(request.params.address);
                break;
            case WC_METHODS.GET_TRANSACTIONS_BY_ID:
                result = await provider?.getTransactionsById(request.params.transactionIds);
                break;
            case WC_METHODS.GET_BLOCKS_BY_ID:
                result = await provider?.getBlocksById(request.params.blockIds);
                break;
            case WC_METHODS.GET_HEAD_INFO:
                result = await provider?.getHeadInfo();
                break;
            case WC_METHODS.GET_CHAIN_ID:
                result = await provider?.getChainId();
                break;
            case WC_METHODS.GET_BLOCKS:
                result = await provider?.getBlocks(request.params.height, request.params.numBlocks, request.params.idRef);
                break;
            case WC_METHODS.GET_BLOCK:
                result = await provider?.getBlock(request.params.height);
                break;
            case WC_METHODS.SUBMIT_BLOCK:
                result = await provider?.submitBlock(request.params.block);
                break;
        }
    
        if (result !== null) {
            const response = formatJsonRpcResult(id, result);
            await wallet.respondSessionRequest({
                topic,
                response,
            });
        }
    },
    
    rejectRequest: async (sessionRequest: SignClientTypes.EventArguments["session_request"]) => {
        const wallet = state.wallet.get();
        if (!wallet) {
            throw new Error("W3 Wallet not available");
        }
    
        const { id, topic } = sessionRequest;
        const response = formatJsonRpcError(id, getSdkError('USER_REJECTED').message);
        await wallet.respondSessionRequest({
            topic,
            response,
        });
    },
    
    refreshActiveSessions: () => {
        const wallet = state.wallet.get();
        if (wallet) {
            state.activeSessions.set(wallet.getActiveSessions());
        }
    },
    
    setPendingProposal: (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
        const wallet = state.wallet.get();
        if (wallet) {
            state.pendingProposal.set(proposal);
        }
    },
    
    unsetPendingProposal: () => {
        const wallet = state.wallet.get();
        if (wallet) {
            state.pendingProposal.set(none);
        }
    },
    
    setPendingRequest: (request: SignClientTypes.EventArguments["session_request"]) => {
        const wallet = state.wallet.get();
        if (wallet) {
            state.pendingRequest.set(request);
        }
    },
    
    unsetPendingRequest: () => {
        const wallet = state.wallet.get();
        if (wallet) {
            state.pendingRequest.set(none);
        }
    },
}

const getters : IWalletConnectGetters = {
    checkMethod: (method: string) : boolean => {
        if (Object.values(WC_METHODS).includes(method)) {
            return true;
        }
    
        return false;
    },
    
    checkNetwork: (chainId: string) => {
        const currentNetworkId = getStore('Setting').state.currentNetworkId.get();
        return currentNetworkId.includes(chainId.replace('koinos:',''));
    }
}

export default {
    state,
    actions,
    getters
};