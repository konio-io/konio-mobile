import { Contract, Provider, Signer, Transaction, utils } from "koilib";
import { Abi, SendTransactionOptions, TransactionJson, TransactionJsonWait, TransactionReceipt } from "koilib/lib/interface";
import { IKoinActions, IKoinGetters } from "../types/store";
import { getStore } from "./registry";

const actions : IKoinActions = {
    signHash: async (
        hash: string
    ): Promise<string> => {
        const signer = getters.getSigner();
        const signedHash = await signer.signHash(utils.decodeBase64(hash));
        return btoa(signedHash.toString());
    },
    
    signMessage: async (
        message: string
    ): Promise<string> => {
        const signer = getters.getSigner();
        const signedMessage = await signer.signMessage(message);
        return btoa(signedMessage.toString());
    },
    
    prepareTransaction: async (
        tx: TransactionJson
    ): Promise<TransactionJson> => {
        
        const signer = getters.getSigner();
        const transaction = Object.assign({}, tx);
        const transactionOptions = await getters.getTransactionOptions();

        if (!transaction.header) {
            transaction.header = {};
        }

        transaction.header.nonce = transactionOptions.nonce;
        transaction.header.payee = transactionOptions.payee;
        transaction.header.payer = transactionOptions.payer;
        transaction.header.rc_limit = transactionOptions.rcLimit;

        return await signer.prepareTransaction(transaction);
    },
    
    signTransaction: async (
        tx: TransactionJson,
        abis?: Record<string, Abi>
    ): Promise<TransactionJson> => {
        const signer = getters.getSigner();
        const transaction = await actions.prepareTransaction(tx);
        return await signer.signTransaction(transaction, abis);
    },
    
    sendTransaction: async (
        tx: TransactionJson,
        options?: SendTransactionOptions
    ): Promise<{
        receipt: TransactionReceipt
        transaction: TransactionJsonWait
    }> => {
        const signer = getters.getSigner();
        const transaction = await actions.prepareTransaction(tx);
        return await signer.sendTransaction(transaction, options);
    },
    
    signAndSendTransaction: async (
        tx: TransactionJson,
        options?: SendTransactionOptions
    ): Promise<{
        receipt: TransactionReceipt
        transaction: TransactionJsonWait
    }> => {
        const signer = getters.getSigner();
        const transaction = await actions.prepareTransaction(tx);
        await signer.signTransaction(transaction, options?.abis);
        return await signer.sendTransaction(transaction, options);
    },
    
    waitForTransaction: async (
        transactionId: string,
        type?: 'byTransactionId' | 'byBlock',
        timeout?: number
    ): Promise<{
        blockId: string,
        blockNumber?: number
    }> => {
        const provider = getters.getProvider();
        return await provider.wait(transactionId, type, timeout);
    },
}

const getters : IKoinGetters = {
    fetchContract: async (contractId: string): Promise<Contract> => {
        const signer = getters.getSigner();
        const provider = signer.provider;
        const contract = new Contract({
            id: contractId,
            provider,
            signer
        });
    
        await contract.fetchAbi();
        if (!contract.abi) {
            throw new Error("unable to fetch contract abi");
        }
    
        //Hack
        Object.keys(contract.abi.methods).forEach(m => {
            if (contract.abi) {
                if (contract.abi.methods[m].entry_point === undefined) {
                    // @ts-ignore
                    contract.abi.methods[m].entry_point = Number(contract.abi.methods[m]["entry-point"]);
                }
                if (contract.abi.methods[m].read_only === undefined) {
                    // @ts-ignore
                    contract.abi.methods[m].read_only = contract.abi.methods[m]["read-only"];
                }
            }
        });
    
        return contract;
    },
    
    getProvider: (): Provider => {
        const networkId = getStore('Setting').state.currentNetworkId.get();
        const rpcNodes = getStore('Network').state.nested(networkId).rpcNodes.get();
        return new Provider([...rpcNodes]);
    },
    
    getSigner: (): Signer => {
        const accountId = getStore('Setting').state.currentAccountId.get();
        const account = getStore('Secure').state.accounts.nested(accountId);
        const provider = getters.getProvider();
        const signer = Signer.fromWif(account.privateKey.get());
        signer.provider = provider;
        return signer;
    },

    getTransactionOptions: async () => {
        const currentAccountId = getStore('Setting').state.currentAccountId.get();
        const currentAddress = getStore('Account').state.nested(currentAccountId).address.get();

        const rcLimit = getStore('Mana').getters.getRcLimit();
        const payer = getStore('Mana').state.payer.get();
                
        /**
         * If payer is free mana set payee as current account
         */
        const currentPayer = getStore('Payer').state.nested(payer).get();
        const payee = (currentPayer && currentPayer.free === true) ? currentAddress : undefined;
        const nonce = await getters.getProvider().getNextNonce(payee || payer);

        return {
            rcLimit: rcLimit.toString(),
            payer,
            payee,
            nonce
        };
    }
}

export default {
    actions,
    getters
};