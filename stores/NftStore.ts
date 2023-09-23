import { hookstate, none } from "@hookstate/core";
import { Nft, NftActions, NftState, NftStore, Store } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localstored } from "./localstored";
import { convertIpfsToHttps } from "../lib/utils";

export const NftStoreLoaded = hookstate(false);

const state = hookstate<NftState>(
    {}, 
    localstored({
        key: 'nft',
        engine: AsyncStorage,
        loaded: NftStoreLoaded
    })
);

export const useNftStore = (store: () => Store) : NftStore => {

    const actions : NftActions = {
        addNft: async (args: {
            contractId: string,
            tokenId: string
        }) => {
            const { contractId, tokenId } = args;
            const accountId = store().Setting.state.currentAccountId.get();
            const networkId = store().Setting.state.currentNetworkId.get();
            const collectionId = store().NftCollection.getters.nftCollectionId(accountId, networkId, contractId);
            const uri = store().NftCollection.state.nested(collectionId).uri.get();
        
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
        
            state.nfts.merge({ [id]: nft });
        
            return nft;
        },
        
        deleteNft: (id: string) => {
            state.nested(id).set(none);
        },
        
        withdrawNft: async (args: {
            id: string,
            to: string
        }) => {
            const currentAccountId = store().Setting.state.currentAccountId.get();
            const currentAddress = store().Account.state.nested(currentAccountId).address.get();
            const nft = state.nested(args.id).get();
        
            const contract = await store().Koin.getters.fetchContract(nft.contractId);
        
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

    const getters = {
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

    return {
        state,
        actions,
        getters
    }
}