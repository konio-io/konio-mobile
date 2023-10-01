import { hookstate, none } from "@hookstate/core";
import { Contact, IContactActions, ContactState } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from '@hookstate/localstored';

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

export default {
    state,
    actions
}