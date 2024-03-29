import { hookstate, none } from "@hookstate/core";
import { Coin, ICoinActions, ICoinGetters, CoinState, Transaction } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "../lib/localstored";
import { utils } from "koilib";
import { TransactionJsonWait } from "koilib/lib/interface";
import { TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_SUCCESS, TOKENS_URL } from "../lib/Constants";
import { accessPropertyValue } from "../lib/utils";
import { getStore, loadedState } from "./registry";

const state = hookstate<CoinState>(
    {},
    localstored({
        key: 'coin',
        engine: AsyncStorage,
        loadedState: loadedState.coin
    })
);

const actions : ICoinActions = {
    addCoin: async (contractId: string) => {
        const accountId = getStore('Setting').state.currentAccountId.get();
        const networkId = getStore('Setting').state.currentNetworkId.get();
    
        const contract = await getters.fetchCoinContract(contractId);
    
        const id = getters.coinId(accountId, networkId, contractId);
        const coin : Coin = {
            id,
            contractId,
            networkId,
            accountId,
            decimal: contract.decimal ?? 0,
            symbol: contract.symbol
        };
    
        state.merge({
            [id]: coin
        });
    
        actions.refreshCoin({
            id,
            balance: true,
            info: true,
            price: true
        });
        
        getStore('Transaction').actions.refreshTransactions(id);

        return coin;
    },

    withdrawCoin: async (args: { 
        id: string, 
        to: string, 
        value: string, 
        note: string 
    }) : Promise<TransactionJsonWait|undefined> => {
        const accountId = getStore('Setting').state.currentAccountId.get();
        const address = getStore('Account').state.nested(accountId).address.get();

        const { id, to, value } = args;
        
        const coin = state.nested(id).get();
        if (!coin) {
            throw new Error("Coin not found in store");
        }
    
        const contract = await getStore('Koin').getters.fetchContract(coin.contractId);
        if (!contract.abi) {
            throw new Error("Contract abi not found");
        }
    
        // optional: preformat input/output
        //contract.abi.methods.balance_of.preformat_argument = (owner) => ({  owner,});
        contract.abi.methods.balance_of.preformat_return = (res: any) => utils.formatUnits(res.value, coin.decimal);
        contract.abi.methods.transfer.preformat_argument = (input: any) => {
            return {
                from: address,
                to: input.to,
                value: utils.parseUnits(input.value, coin.decimal),
            };
        }
    
        const transactionOptions = await getStore('Koin').getters.getTransactionOptions();
        const { transaction, receipt } = await contract.functions.transfer({
            to,
            value,
        }, transactionOptions);
    
        if (!transaction || !transaction.id) {
            throw new Error("Error during transaction, not return transaction or its id");
        }
    
        if (receipt && receipt.logs) {
            throw new Error(`Transfer failed. Logs: ${receipt.logs.join(",")}`);
        }

        const tsx: Transaction = {
            id: transaction.id,
            transactionId: transaction.id,
            networkId: coin.networkId,
            contractId: coin.contractId,
            from: address,
            to,
            value,
            timestamp: Date.now(),
            status: TRANSACTION_STATUS_PENDING,
        };
    
        getStore('Transaction').actions.addTransaction(tsx);
        
        return transaction;
    },
    
    withdrawCoinConfirm: async (args: {
        id: string,
        transaction: TransactionJsonWait
    }) : Promise<Transaction|undefined> => {
        
        const { id, transaction } = args;
    
        if (!transaction.id) {
            throw new Error("Transaction id not found");
        }
    
        let blockNumber = null;
        try {
            const result = await transaction.wait();
            if (!result.blockNumber) {
                throw new Error("Unable to retrieve block number");
            }
            blockNumber = result.blockNumber;
    
        } catch (e) {
            getStore('Transaction').actions.updateTransaction(transaction.id, { status: TRANSACTION_STATUS_ERROR });
            throw e;
        }
    
        getStore('Transaction').actions.updateTransaction(transaction.id, { status: TRANSACTION_STATUS_SUCCESS });
    
        actions.refreshCoinBalance(id);
        getStore('Mana').actions.refreshMana();
    
        return getStore('Transaction').state.nested(transaction.id).get();
    },
    
    deleteCoin: (id: string) => {
        state.nested(id).set(none);
    },
    
    refreshCoins: (args?: {
        contract?: boolean,
        info?: boolean,
        balance?: boolean,
        price?: boolean
    }) => {
        const coins = getters.getCoins();
    
        const promises = [];
    
        for (const coin of coins) {
            const promise = actions.refreshCoin({
                ...args,
                id: coin.id
            });
    
            promises.push(promise);
        }
    
        return Promise.all(promises);
    },
    
    /**
     * refresh coin data
     */
    refreshCoin: async(args: {
        id: string,
        contract?: boolean,
        info?: boolean,
        balance?: boolean,
        price?: boolean
    }) => {
        const promises = [];
    
        if (args.contract === true) {
            await actions.refreshCoinContract(args.id);
        }
    
        if (args.balance === true) {
            promises.push( actions.refreshCoinBalance(args.id) );
        }
    
        if (args.info === true) {
            promises.push( actions.refreshCoinInfo(args.id) );
        }
    
        if (args.price === true) {
            promises.push( actions.refreshCoinPrice(args.id) );
        }
    
        return Promise.all(promises);
    },
    
    refreshCoinContract: (id: string) => {
        console.log('refresh contract', id)
        const coin = state.nested(id);
    
        return getters.fetchCoinContract(coin.contractId.get())
            .then(async contract => {
                if (contract.symbol) {
                    coin.symbol.set(contract.symbol);
                }
                if (contract.decimal) {
                    coin.decimal.set(contract.decimal);
                }
            })
            .catch(e => getStore('Log').actions.logError(e))
    },
    
    refreshCoinBalance: (id: string) => {
        console.log('refresh balance', id);
        const coin = state.nested(id);
    
        return getters.fetchCoinBalance(coin.contractId.get())
        .then(balance => {
            if (balance) {
                if (coin.decimal.get()) {
                    coin.balance.set( parseFloat(utils.formatUnits(balance, coin.decimal.get())) );
                } else {
                    coin.balance.set(balance);
                }
            } else {
                coin.balance.set(0);
            }
        })
        .catch(e => {
            getStore('Log').actions.logError(e)
        });
    },
    
    refreshCoinInfo: (id: string) => {
        console.log('refresh info', id);
        const coin = state.nested(id);
    
        return getters.fetchContractInfo(coin.contractId.get())
            .then(info => {
                if (info.logo) {
                    coin.logo.set(info.logo);
                }
                if (info.name) {
                    coin.name.set(info.name);
                }
            }).catch(e => {
                //unable to retrieve info
            })
    },
    
    refreshCoinPrice: async (id: string) => {
        console.log('refresh price', id);
        const coin = state.nested(id);
    
        return getters.fetchCoinPrice(coin.contractId.get())
            .then(price => {
                if (price) {
                    coin.price.set(price);
                }
            }).catch(e => 
                getStore('Log').actions.logError(e)
            );
    },
}

const getters : ICoinGetters = {
    getCoins: () => {
        const accountId = getStore('Setting').state.currentAccountId.get();
        const networkId = getStore('Setting').state.currentNetworkId.get();

        return Object.values(state.get({noproxy: true})).filter(coin => 
            coin.networkId === networkId &&
            coin.accountId === accountId
        );
    },

    coinId: (accountId: string, networkId: string, contractId: string) => {
        return `${accountId}/${networkId}/${contractId}`;
    },
    
    fetchContractInfo: async (contractId: string) => {
        return fetch(`${TOKENS_URL}/${contractId}.json`)
            .then(response => response.json());
    },
    
    fetchCoinPrice: async (contractId: string) => {
        const response = await getters.fetchContractInfo(contractId)
        if (response.priceUrl && response.pricePath && response.priceUnit) {
            const priceResponse = await (await fetch(response.priceUrl)).json();
            if (priceResponse) {
                const price = accessPropertyValue(priceResponse, response.pricePath);

                if (response.priceUnit === 'USD') {
                    return price;
                } else if (response.priceUnit === 'KOIN') {
                    const {currentAccountId, currentNetworkId} = getStore('Setting').state.get();
                    const koinContractId = getStore('Network').state.nested(currentNetworkId)?.koinContractId?.get();
                    if (koinContractId) {
                        const koinId = getters.coinId(currentAccountId, currentNetworkId, koinContractId);
                        const koinPrice = state.nested(koinId).price?.get() ?? 0;
                        return (koinPrice * price);
                    }
                }

            }
        }
    
        return null;
    },
    
    fetchCoinBalance: async (contractId: string) => {
        const contract = await getStore('Koin').getters.fetchContract(contractId);
        const accountId = getStore('Setting').state.currentAccountId.get();
        const address = getStore('Account').state.nested(accountId).address.get();
    
        const balanceResponse = await contract.functions.balance_of({ owner: address });
    
        if (balanceResponse && balanceResponse.result?.value !== undefined) {
            return parseFloat(balanceResponse.result?.value);
        }
    
        return null;
    },
    
    fetchCoinContract: async (contractId: string) => {
        const contract = await getStore('Koin').getters.fetchContract(contractId);
        const result = { ...contract, symbol: '', decimal: undefined };
      
        const symbolResponse = await contract.functions.symbol();
        if (symbolResponse.result?.value) {
            result.symbol = symbolResponse.result.value;
        }
    
        const decimalResponse = await contract.functions.decimals();
        if (decimalResponse.result?.value) {
            result.decimal = decimalResponse.result.value;
        }
    
        return result;
    }
}

export default {
    state,
    actions,
    getters
}