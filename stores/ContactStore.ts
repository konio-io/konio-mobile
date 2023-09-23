import { hookstate, none } from "@hookstate/core";
import { Contact, ContactActions, ContactGetters, ContactState, ContactStore, Store } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";
import { utils } from "koilib";

export const ContactStoreLoaded = hookstate(false);

const state = hookstate<ContactState>(
    {}, 
    localstored({
        key: 'contact',
        engine: AsyncStorage,
        loaded: ContactStoreLoaded
    })
);

export const useContactStore = (store: () => Store): ContactStore => {

    const actions : ContactActions = {
        addContact: (item: Contact) => {
            state.merge({ [item.address]: item });
        },
        
        deleteContact: (address: string) => {
            state.nested(address).set(none);
        }
    }

    const getters : ContactGetters = {
        getContact: (search: string) => {
            const accounts = store().Account.state;
            const addressbook = state;
            const kap = store().Kap.state;
        
            const accountByAddress = accounts[search].get();
            if (accountByAddress) {
                return {
                    name: accountByAddress.name,
                    address: search,
                    addable: false
                };
            }
        
            const accountByName = Object.values(accounts.get()).find(account => account.name === search);
            if (accountByName) {
                return {
                    name: search,
                    address: accountByName,
                    addable: false
                };
            }
        
            const contactByAddress = addressbook[search].get();
            if (contactByAddress) {
                return {
                    name: contactByAddress.name,
                    address: search,
                    addable: false
                };
            }
        
            const contactByName = Object.values(addressbook.get()).find(contact => contact.name === search);
            if (contactByName) {
                return {
                    name: search,
                    address: contactByName,
                    addable: false
                };
            }
        
            if (store().Network.getters.isMainnet()) {
                const kapByAddress = kap[search].get();
                if (kapByAddress) {
                    return {
                        name: kapByAddress,
                        address: search,
                        addable: true
                    }
                }
        
                const kapByName = Object.keys(kap.get()).find(address => address === search);
                if (kapByName) {
                    return {
                        name: search,
                        address: kapByName,
                        addable: true
                    };
                }
            }
        
            try {
                const check = utils.isChecksumAddress(search);
                if (check) {
                    return {
                        name: '',
                        address: search,
                        addable: true
                    }
                }
            } catch (e) {
                return undefined;
            }
        
            return undefined;
        }
    }

    return {
        state,
        actions,
        getters
    }

}