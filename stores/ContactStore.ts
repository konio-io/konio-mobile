import { hookstate, none } from "@hookstate/core";
import { Contact, IContactActions, IContactGetters, ContactState } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from '@hookstate/localstored';
import { utils } from "koilib";
import { getStore } from "./registry";

const state = hookstate<ContactState>(
    {}, 
    localstored({
        key: 'contact',
        engine: AsyncStorage
    })
);

const actions : IContactActions = {
    addContact: (item: Contact) => {
        state.merge({ [item.address]: item });
    },
    
    deleteContact: (address: string) => {
        state.nested(address).set(none);
    }
}

const getters : IContactGetters = {
    getContact: (search: string) => {
        const accounts = getStore('Account').state;
        const addressbook = state;
        const kap = getStore('Kap').state;
    
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
                address: accountByName.name,
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
                address: contactByName.name,
                addable: false
            };
        }
    
        if (getStore('Network').getters.isMainnet()) {
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

export default {
    state,
    actions,
    getters
}