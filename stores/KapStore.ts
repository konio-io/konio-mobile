import { hookstate } from "@hookstate/core";
import { KAP_NAMESERVICE_CID, KAP_PROFILE_CID } from "../lib/Constants";
import { utils } from "koilib";
import { KapActions, KapGetters, KapState, KapStore, Store } from "./types";

const state = hookstate<KapState>({});

export const useKapStore = (store: () => Store): KapStore => {
    
    const actions : KapActions = {
        refreshKap: async (search: string) => {
            if (store().Network.getters.isMainnet()) {
                if (search.includes('.')) {
                    const address = await getters.getKapAddressByName(search)
                    if (address) {
                        state.merge({ [address]: search })
                    }
                }
        
                const profile = await getters.getKapProfileByAddress(search)
                if (profile?.name) {
                    state.merge({ [search]: profile.name });
                }
            }
        }
    }

    const getters : KapGetters = {
        getKapAddressByName: async (name: string) => {
            const contractId = KAP_NAMESERVICE_CID;
        
            const contract = await store().Koin.getters.fetchContract(contractId);
        
            const buffer = new TextEncoder().encode(name);
            const token_id = "0x" + utils.toHexString(buffer);
        
            const response = await contract.functions.owner_of<{ value: string; }>({ token_id });
            return response.result?.value;
        },
        
        getKapProfileByAddress: async (address: string) => {
            const contractId = KAP_PROFILE_CID;
        
            const contract = await store().Koin.getters.fetchContract(contractId);
        
            const response = await contract.functions.get_profile({
                address
            });
        
            return response.result;
        }
    }

    return {
        state,
        actions,
        getters
    }

}