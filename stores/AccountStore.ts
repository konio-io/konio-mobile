import { hookstate, none } from "@hookstate/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "../lib/localstored";
import { Signer } from "koilib";
import { Account, AccountSecure, AccountState, Coin, IAccountActions } from "../types/store";
import { getStore, loadedState } from "./registry";
import { createWallet } from "../lib/utils";

export const state = hookstate<AccountState>(
    {},
    localstored({
        key: 'account',
        engine: AsyncStorage,
        loadedState: loadedState.account
    })
)

export const actions : IAccountActions = {
    addAddress: async (accountId: string, name: string) => {
        const networks = Object.values(getStore('Network').state.get());
        
        for (const network of networks) {
            const contractId = network.koinContractId;
            const id = getStore('Coin').getters.coinId(accountId, network.id, contractId);
            const coin : Coin = {
                id,
                accountId: accountId,
                networkId: network.id,
                contractId,
                decimal: 8,
                symbol: 'KOIN'
            }
            
            try {
                const info = await getStore('Coin').getters.fetchContractInfo(contractId);
                coin.name = info.name;
                coin.logo = info.logo;
            } catch (e) {}
    
            getStore('Coin').state.merge({
                [id]: coin
            });
        }
    
        const account: Account = {
            id: accountId,
            name,
            address: accountId
        };
        state.merge({ [account.address]: account });
    },
    
    addSeed: async (args: {
        seed: string,
        name: string
    }) => {
        const { seed, name } = args;
        const { address, privateKey } = await createWallet(seed, 0);
    
        await actions.addAddress(address, name);

        const accountSecure : AccountSecure = {
            id: address,
            address,
            privateKey,
            seed,
            accountIndex: 0
        }
    
        getStore('Secure').actions.addAccount(accountSecure);
    
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

        getStore('Secure').actions.addAccount(accountSecure);
    
        return address;
    },
    
    addAccount: async (name: string) => {
        const account = Object.values(getStore('Secure').state.accounts.get()).find(w => w.seed !== undefined);
    
        if (!account) {
            throw new Error("Unable to find main seed account");
        }
    
        if (account.seed === undefined) {
            throw new Error("Provided account address is not a seed account");
        }
    
        if (account.accountIndex === undefined) {
            throw new Error("Provided account address does not have an accountIndex");
        }
    
        const { address, privateKey } = await createWallet(account.seed, account.accountIndex + 1);
    
        await actions.addAddress(address, name);
    
        const accountSecure = {
            id: address,
            address,
            privateKey
        };
    
        getStore('Secure').actions.addAccount(accountSecure);
        
        return address;
    },
    
    deleteAccount: (id: string) => {
        const seedAccountId = getStore('Secure').getters.getSeedAccountId();
        if (!seedAccountId) {
            throw new Error("Unable to retrieve seed account");
        }
    
        if (seedAccountId === id) {
            throw new Error("Cannot delete seed account");
        }
        
        getStore('Setting').actions.setCurrentAccount(seedAccountId);
        getStore('Secure').actions.deleteAccount(id);
        state.nested(id).set(none);
    },
    
    setAccountName: (address: string, name: string) => {
        state.nested(address).name.set(name);
    },
}

export default {
    state,
    actions
}