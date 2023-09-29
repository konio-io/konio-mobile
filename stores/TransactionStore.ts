import { hookstate, none } from "@hookstate/core";
import { ITransactionActions, ITransactionGetters, TransactionState, Transaction } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from '@hookstate/localstored';
import { getStore } from "./registry";
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS } from "../lib/Constants";
import { utils } from "koilib";

const state = hookstate<TransactionState>(
    {},
    localstored({
        key: 'transaction',
        engine: AsyncStorage
    })
);

const actions: ITransactionActions = {
    addTransaction: async (transaction: Transaction) => {
        state.merge({
            [transaction.id]: transaction
        });
    },

    updateTransaction: async (transactionId: string, data: any) => {
        const transactionState = state.nested(transactionId);
        transactionState.merge({
            ...data
        });
    },

    refreshTransactions: async (coinId: string) => {
        const cb = (transaction: Transaction) => {
            actions.addTransaction(transaction);
        }

        console.log(`refreshing transactions ${coinId}`);
        await getters.getTransactionHistory({coinId: coinId, cb: cb});
    },
}

const getters: ITransactionGetters = {

    getTransactionHistory: async (args: {
        coinId: string,
        seqNum?: number,
        limit?: number,
        ascending?: boolean,
        cb?: Function
    }) => {

        const coin = getStore('Coin').state.nested(args.coinId).get();
        const contract = await getStore('Koin').getters.fetchContract(coin.contractId);

        //reset latest transactions
        for (const itemToDelete of Object.values(state.get())) {
            if (itemToDelete.contractId === coin.contractId) {
                state.nested(itemToDelete.id).set(none);
            }
        }

        const result : Array<Transaction> = [];
        const provider = getStore('Koin').getters.getProvider();
        const networkId = getStore('Setting').state.currentNetworkId.get();
        const accountId = getStore('Setting').state.currentAccountId.get();
        const address = getStore('Account').state.nested(accountId).address.get();

        const response: any = await provider.call("account_history.get_account_history", {
            address,
            ascending: args.ascending ?? false,
            limit: args.limit ?? 10,
            seq_num: args.seqNum,
        });

        if (response.values?.length > 0) {

            for (const item of response.values) {
                const operations = item.trx?.transaction?.operations;
                const transactionId = item.trx?.transaction?.id;
                const id = transactionId;

                if (!operations || operations?.length === 0 || !transactionId) {
                    continue;
                }

                for (const operation of operations) {
                    const opContractId = operation.call_contract?.contract_id;
                    if (!opContractId || coin.contractId !== opContractId) {
                        continue;
                    }

                    const decodedOperation = await contract.decodeOperation(operation);
                    if (!decodedOperation?.name || !decodedOperation?.args) {
                        continue;
                    }

                    //@ts-ignore
                    const opArgs : OperationArgs = decodedOperation.args;
                    console.log(opArgs)

                    const transaction : Transaction = {
                        id,
                        transactionId,
                        networkId,
                        contractId: coin.contractId,
                        from: opArgs.from,
                        to: opArgs.to,
                        status: TRANSACTION_STATUS_SUCCESS
                    };

                    if (opArgs.value) {
                        transaction.value = utils.formatUnits(opArgs.value, coin.decimal);
                    } else if (opArgs.tokenId) {
                        transaction.tokenId = opArgs.tokenId;
                    }

                    const transactionResponse = await provider.getTransactionsById([transactionId]);
                    if (transactionResponse?.transactions?.length === 0) {
                        continue;
                    }

                    const transactionBlocks = transactionResponse.transactions[0]?.containing_blocks;
                    if (!transactionBlocks) {
                        transaction.status = TRANSACTION_STATUS_ERROR;
                        continue;
                    }

                    if (transactionBlocks.length > 1) {
                        transaction.status = TRANSACTION_STATUS_PENDING;
                    }

                    const blockResponse = await provider.getBlocksById(transactionBlocks);
                    if (blockResponse?.block_items?.length === 0) {
                        continue;
                    }

                    const timestamp = blockResponse.block_items[0].block?.header?.timestamp;
                    if (timestamp) {
                        transaction.timestamp = parseInt(timestamp);
                    }

                    if (args.cb) {
                        args.cb(transaction);
                    }

                    result.push(transaction);
                }
            }
        }

        return result;
    }
}

type OperationArgs = {
    from: string,
    to: string,
    value?: string,
    tokenId?: string
}

export default {
    state,
    actions,
    getters
}