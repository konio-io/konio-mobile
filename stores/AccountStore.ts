import { hookstate, none } from "@hookstate/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";
import { Signer } from "koilib";
import HDKoinos from "../lib/HDKoinos";
import { AccountStore, Store, Account, AccountState, Coin, AccountActions, AccountSecure } from "./types";

export const AccountStoreLoaded = hookstate(false);

export const state = hookstate<AccountState>(
    {},
    localstored({
        key: 'account',
        engine: AsyncStorage,
        loaded: AccountStoreLoaded
    })
)

export const useAccountStore = (store: () => Store): AccountStore => {

    const actions : AccountActions = {
        addAddress: async (accountId: string, name: string) => {
            const networks = Object.values(store().Network.state.get());
            
            for (const network of networks) {
                const contractId = network.koinContractId;
                const id = store().Coin.getters.coinId(accountId, network.id, contractId);
                const coin : Coin = {
                    id,
                    accountId: accountId,
                    networkId: network.id,
                    contractId,
                    decimal: 8,
                    symbol: 'KOIN'
                }
                
                try {
                    const info = await store().Coin.getters.fetchContractInfo(contractId);
                    coin.name = info.name;
                    coin.logo = info.logo;
                } catch (e) {}
        
                store().Coin.state.coins.merge({
                    [id]: coin
                });
            }
        
            const account: Account = {
                id: accountId,
                name,
                address: accountId
            };
            state.accounts.merge({ [account.address]: account });
        },
        
        addSeed: async (args: {
            seed: string,
            name: string
        }) => {
            const { seed, name } = args;
            const { address, privateKey } = await HDKoinos.createWallet(seed, 0);
        
            await actions.addAddress(address, name);

            const accountSecure : AccountSecure = {
                id: address,
                address,
                privateKey,
                seed,
                accountIndex: 0
            }
        
            store().Secure.actions.addAccount(accountSecure);
        
            return address;
        },
        
        importAccount: async (args: {
            privateKey: string,
            name: string
        }) => {
            const { privateKey, name } = args;
            const signer = Signer.fromWif(privateKey);
            const address = signer.getAddress();
        
            await actions.addAddress(address, name);

            const accountSecure : AccountSecure = {
                id: address,
                address,
                privateKey,
                accountIndex: 0
            };

            store().Secure.actions.addAccount(accountSecure);
        
            return address;
        },
        
        addAccount: async (name: string) => {
            const account = Object.values(store().Secure.state.accounts.get()).find(w => w.seed !== undefined);
        
            if (!account) {
                throw new Error("Unable to find main seed account");
            }
        
            if (account.seed === undefined) {
                throw new Error("Provided account address is not a seed account");
            }
        
            if (account.accountIndex === undefined) {
                throw new Error("Provided account address does not have an accountIndex");
            }
        
            const { address, privateKey } = await HDKoinos.createWallet(account.seed, account.accountIndex + 1);
        
            await actions.addAddress(address, name);
        
            const accountSecure = {
                id: address,
                address,
                privateKey
            }
        
            store().Secure.actions.addAccount(accountSecure);
            
            return address;
        },
        
        deleteAccount: (id: string) => {
            const seedAccountId = store().Secure.actions.getSeedAccountId();
            if (!seedAccountId) {
                throw new Error("Unable to retrieve seed account");
            }
        
            if (seedAccountId === id) {
                throw new Error("Cannot delete seed account");
            }
            
            store().Setting.actions.setCurrentAccount(seedAccountId);
            store().Secure.actions.deleteAccount(id);
            state.nested(id).set(none);
        },
        
        setAccountName: (address: string, name: string) => {
            state.nested(address).name.set(name);
        },
    }

    return {
        state,
        actions
    }
}

