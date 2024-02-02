import { hookstate, none } from "@hookstate/core";
import { NftCollection, INftCollectionActions, NftCollectionState, INftCollectionGetters } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from '@hookstate/localstored';
import { getStore } from "./registry";
import { KOLLECTION_OWNERSHIP_API_URL } from "../lib/Constants";

const state = hookstate<NftCollectionState>(
    {},
    localstored({
        key: 'nftCollection',
        engine: AsyncStorage
    })
);

const actions: INftCollectionActions = {

    refreshTokens: async (contractId: string) => {
        const accountId = getStore('Setting').state.currentAccountId.get();
        const tokenIds = await getters.getNftOwnedTokenIds(contractId, accountId);

        for (const tokenId of tokenIds) {
            await getStore('Nft').actions.addNft({
                contractId,
                tokenId
            });
        }

        for (const nft of Object.values(getStore('Nft').state.get())) {
            if (nft.id.includes(contractId) && !tokenIds.includes(nft.tokenId)) {
                getStore('Nft').state.nested(nft.id).set(none);
            }
        }
    },

    addNftCollection: async (contractId: string) => {
        const accountId = getStore('Setting').state.currentAccountId.get();
        const networkId = getStore('Setting').state.currentNetworkId.get();

        const contract = await getters.getNftContract(contractId);
        const id = getters.nftCollectionId(accountId, networkId, contractId);
        const collection: NftCollection = {
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
        const nfts = Object.values(getStore('Nft').state.get()).filter(nft => nft.nftCollectionId === id);
        nfts.map(nft => getStore('Nft').actions.deleteNft(nft.id));
    },
}

const getters: INftCollectionGetters = {
    nftCollectionId: (accountId: string, networkId: string, contractId: string) => {
        return [accountId, networkId, contractId].join('/');
    },

    getNftContract: async (contractId: string) => {
        const contract = await getStore('Koin').getters.fetchContract(contractId);

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

    getNftOwnedTokenIds: async (contractId: string, accountId: string) => {
        const contract = await getStore('Koin').getters.fetchContract(contractId);
        let tokenIds = [];

        if (contract.functions.get_tokens_by_owner) {
            const tokenIdsResponse = await contract.functions.get_tokens_by_owner({
                owner: accountId,
                limit: 100
            });
            if (tokenIdsResponse?.result?.token_ids) {
                tokenIds = tokenIdsResponse?.result?.token_ids;
            }
        } else {
            const kollectionResponse = (await fetch(`${KOLLECTION_OWNERSHIP_API_URL}/${accountId}`));
            const kollectionResponseJson = await kollectionResponse.json();
            if (kollectionResponseJson.data) {
                for (const nftItem of kollectionResponseJson.data) {
                    if (nftItem.collection === contract.getId()) {
                        tokenIds.push(nftItem.token);
                    }
                }
            }
        }

        return tokenIds;
    }
}

export default {
    state,
    actions,
    getters
};