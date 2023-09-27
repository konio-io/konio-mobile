import { hookstate, none } from "@hookstate/core";
import { Nft, INftActions, NftState, INftGetters } from "../types/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from '@hookstate/localstored';
import { convertIpfsToHttps } from "../lib/utils";
import { getStore } from "./registry";

const state = hookstate<NftState>(
    {}, 
    localstored({
        key: 'nft',
        engine: AsyncStorage
    })
);

const actions : INftActions = {
    addNft: async (args: {
        contractId: string,
        tokenId: string
    }) => {
        const { contractId, tokenId } = args;
        const accountId = getStore('Setting').state.currentAccountId.get();
        const networkId = getStore('Setting').state.currentNetworkId.get();
        const collectionId = getStore('NftCollection').getters.nftCollectionId(accountId, networkId, contractId);
        const uri = getStore('NftCollection').state.nested(collectionId).uri.get();
    
        const token = await getters.fetchNft({
            uri,
            tokenId
        });
    
        //to do check owner_of
    
        const id = getters.nftId(accountId, networkId, contractId, tokenId);

        const nft: Nft = {
            id,
            tokenId,
            contractId,
            networkId,
            accountId,
            nftCollectionId: collectionId,
            description: token.description ?? 'unknown',
            image: token.image ?? 'unknown',
        };
    
        state.merge({ [id]: nft });
    
        return nft;
    },
    
    deleteNft: (id: string) => {
        const nft = state.nested(id);
        const nftCollectionId = nft.nftCollectionId.get({noproxy: true});
        nft.set(none);
        const nftsInSameCollection = Object.values(state.get()).filter(nft => nft.nftCollectionId === nftCollectionId);
        if (nftsInSameCollection.length === 0) {
            getStore('NftCollection').actions.deleteNftCollection(nftCollectionId);
        }
    },
    
    withdrawNft: async (args: {
        id: string,
        to: string
    }) => {
        const currentAccountId = getStore('Setting').state.currentAccountId.get();
        const currentAddress = getStore('Account').state.nested(currentAccountId).address.get();
        const nft = state.nested(args.id).get();
    
        const contract = await getStore('Koin').getters.fetchContract(nft.contractId);
    
        return contract.functions.transfer({
            from: currentAddress,
            to: args.to,
            token_id: nft.tokenId
        });
    },
    
    withdrawNftConfirm: async (id: string) => {
        actions.deleteNft(id);
        return true;
    },
}

const getters : INftGetters = {
    fetchNft: async (args: {
        uri: string,
        tokenId: string
    }) => {
        const { uri, tokenId } = args;
        const url = convertIpfsToHttps(uri);
    
        const dataResponse = await fetch(`${url}/${tokenId}`);
        if (!dataResponse) {
            throw new Error(`Unable to retrieve NFT url ${url}/${tokenId}`);
        }
    
        const response = await dataResponse.json();
        if (!response) {
            throw new Error(`Unable to decode NFT url ${url}/${tokenId}`);
        }
    
        return response;
    },
    
    nftId: (accountId: string, networkId: string, contractId: string, tokenId: string) => {
        return [accountId, networkId, contractId, tokenId].join('/');
    }
}

export default {
    state,
    actions,
    getters
};