import { hookstate } from "@hookstate/core";
import { KAP_NAMESERVICE_CID, KAP_PREFIX, KAP_PROFILE_CID, NIC_NAMESERVICE_CID, NIC_PREFIX } from "../lib/Constants";
import { utils } from "koilib";
import { INameserverActions, INameserverGetters, NameserverState } from "../types/store";
import { getStore } from "./registry";

const state = hookstate<NameserverState>({});

const actions: INameserverActions = {
    add: (address: string, ns: string) => {
        state.nested(address).set(ns);
    }
}

const getters: INameserverGetters = {

    validateKapQuery: (query: string) => {
        if (query.toLowerCase().startsWith(KAP_PREFIX)) {
            const name = query.replace(KAP_PREFIX, '');
            if (name.length >= 3 && name.includes('.koin')) {
                return query.toLowerCase().replace(KAP_PREFIX, '');
            }
        }

        return null;
    },

    validateNicQuery: (query: string) => {
        if (query.toLowerCase().startsWith(NIC_PREFIX)) {
            const name = query.replace(NIC_PREFIX, '');
            if (name.length >= 3) {
                return query.toLowerCase().replace(NIC_PREFIX, '');
            }
        }

        return null;
    },

    getAddress: async (query: string) => {
        if (getStore('Network').getters.isMainnet()) {
            if (getters.validateKapQuery(query)) {
                const name = query.toLocaleLowerCase().replace(KAP_PREFIX, '');
                return getters.getKapAddressByName(name);
            }

            else if (getters.validateNicQuery(query)) {
                const name = query.toLocaleLowerCase().replace(NIC_PREFIX, '');
                return getters.getNicAddressByName(name);
            }
        }

        return undefined;
    },

    getNicNameByAddress: async (address: string) => {
        if (getStore('Network').getters.isMainnet()) {
            try {
                const contract = await getStore('Koin').getters.fetchContract(NIC_NAMESERVICE_CID);
                const response = await contract.functions.get_tokens_by_owner({
                    address,
                    limit: 1
                });
                return response.result?.token_ids[0];
            } catch (e) {
                getStore('Log').actions.logError(String(e));
            }
        }

        return undefined;
    },

    getNicAddressByName: async (name: string) => {
        if (getStore('Network').getters.isMainnet()) {
            try {
                const contract = await getStore('Koin').getters.fetchContract(NIC_NAMESERVICE_CID);
                const buffer = new TextEncoder().encode(name);
                const token_id = "0x" + utils.toHexString(buffer);
                const response = await contract.functions.owner_of<{ account: string; }>({ token_id });
                return response.result?.account;
            } catch (e) {
                getStore('Log').actions.logError(String(e));
            }
        }

        return undefined;
    },

    getKapAddressByName: async (name: string) => {
        if (getStore('Network').getters.isMainnet()) {
            try {
                const contract = await getStore('Koin').getters.fetchContract(KAP_NAMESERVICE_CID);
                const buffer = new TextEncoder().encode(name);
                const token_id = "0x" + utils.toHexString(buffer);

                const response = await contract.functions.owner_of<{ value: string; }>({ token_id });
                return response.result?.value;
            } catch (e) {
                getStore('Log').actions.logError(String(e));
            }
        }

        return undefined;
    },

    getKapProfileByAddress: async (address: string) => {
        if (getStore('Network').getters.isMainnet()) {
            try {
                const contract = await getStore('Koin').getters.fetchContract(KAP_PROFILE_CID);
                const response = await contract.functions.get_profile({
                    address
                });

                return response.result;
            } catch (e) {
                getStore('Log').actions.logError(String(e));
            }
        }

        return undefined;
    }
}

export default {
    state,
    actions,
    getters
};