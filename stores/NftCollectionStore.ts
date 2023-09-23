import { hookstate, none } from "@hookstate/core";
import { NftCollection, NftCollectionActions, NftCollectionState, NftCollectionStore, Store } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";

export const NftCollectionLoaded = hookstate(false);

const state = hookstate<NftCollectionState>(
    {}, 
    localstored({
        key: 'nftCollection',
        engine: AsyncStorage,
        loaded: NftCollectionLoaded
    })
);

export const useNftCollectionStore = (store: () => Store) : NftCollectionStore => {

    const actions : NftCollectionActions = {
        addNftCollection: async (contractId: string) => {
            const accountId = store().Setting.state.currentAccountId.get();
            const networkId = store().Setting.state.currentNetworkId.get();

            const contract = await getters.getNftContract(contractId);
            const id = getters.nftCollectionId(accountId, networkId, contractId);
            const collection : NftCollection = {
                id,
                contractId,
                networkId,
                accountId,
                owner: contract.owner,
                symbol: contract.symbol,
                name: contract.name,
                uri: contract.uri,
            };

            state.merge({
                [id]: collection
            });

            return collection;
        },

        deleteNftCollection: (id: string) => {
            state.nested(id).set(none);
        },
    }

    const getters = {
        nftCollectionId: (accountId: string, networkId: string, contractId: string) => {
            return [accountId, networkId, contractId].join('/');
        },

        getNftContract: async (contractId: string) => {
            const contract = await store().Koin.getters.fetchContract(contractId);

            const uriResponse = await contract.functions.uri();
            if (!uriResponse || !uriResponse.result?.value) {
                throw new Error(`Unable to retrieve uri for NFT collection ${contractId}`);
            }
            const uri = uriResponse.result?.value;

            const nameResponse = await contract.functions.name();
            if (!nameResponse || !nameResponse.result?.value) {
                throw new Error(`Unable to retrieve name for NFT collection ${contractId}`);
            }
            const name = nameResponse.result?.value;

            const symbolResponse = await contract.functions.symbol();
            if (!symbolResponse || !symbolResponse.result?.value) {
                throw new Error(`Unable to retrieve symbol for NFT collection ${contractId}`);
            }
            const symbol = symbolResponse.result?.value;

            const ownerResponse = await contract.functions.owner();
            if (!ownerResponse || !ownerResponse.result?.value) {
                throw new Error(`Unable to retrieve owner for NFT collection ${contractId}`);
            }
            const owner = ownerResponse.result?.value;

            return { contractId, name, symbol, uri, owner };
        },
    }

    return {
        state,
        actions,
        getters
    }
}