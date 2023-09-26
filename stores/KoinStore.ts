import { Contract, Provider, Signer, utils } from "koilib";
import { Abi, SendTransactionOptions, TransactionJson, TransactionJsonWait, TransactionReceipt } from "koilib/lib/interface";
import { IKoinActions, IKoinGetters } from "../types/store";
import { getStore } from "./registry";

const actions : IKoinActions = {
    signHash: async (
        signer: Signer,
        hash: string
    ): Promise<string> => {
        const signedHash = await signer.signHash(utils.decodeBase64(hash));
        return btoa(signedHash.toString());
    },
    
    signMessage: async (
        signer: Signer,
        message: string
    ): Promise<string> => {
        const signedMessage = await signer.signMessage(message);
        return btoa(signedMessage.toString());
    },
    
    prepareTransaction: async (
        signer: Signer,
        tx: TransactionJson
    ): Promise<TransactionJson> => {
        const transaction = Object.assign({}, tx);
        return await signer.prepareTransaction(transaction);
    },
    
    signTransaction: async (
        signer: Signer,
        tx: TransactionJson,
        abis?: Record<string, Abi>
    ): Promise<TransactionJson> => {
        const transaction = Object.assign({}, tx);
        return await signer.signTransaction(transaction, abis);
    },
    
    sendTransaction: async (
        signer: Signer,
        tx: TransactionJson,
        options?: SendTransactionOptions
    ): Promise<{
        receipt: TransactionReceipt
        transaction: TransactionJsonWait
    }> => {
        const transaction = Object.assign({}, tx);
        return await signer.sendTransaction(transaction, options);
    },
    
    signAndSendTransaction: async (
        signer: Signer,
        tx: TransactionJson,
        options?: SendTransactionOptions
    ): Promise<{
        receipt: TransactionReceipt
        transaction: TransactionJsonWait
    }> => {
        const transaction = await actions.signTransaction(signer, tx, options?.abis);
        return await actions.sendTransaction(signer, transaction, options);
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
}

export default {
    actions,
    getters
};