/*
import { useHookstate } from "@hookstate/core";
import { UserStore, EncryptedStore, LockStore, WCStore, KapStore, SpinnerStore, ManaStore } from "../stores";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { useEffect, useState } from "react";
import { selectAccount, selectAccounts, selectAddressBook, selectCoin, selectCoinTransaction, selectCoinTransactions, selectCoins, selectContact, selectCurrentAddress, selectCurrentNetworkId, selectKap, selectNetwork, selectNetworks, selectNft, selectNftCollection, selectNfts } from "../selectors";
import { NFT } from "../types/store";


export const useCurrentNetworkIdState = () => {
    return useHookstate( selectCurrentNetworkId() );
}

export const useCurrentAddressState = () => {
    return useHookstate( selectCurrentAddress() );
}

export const useCurrentNetworkId = () => {
    return useHookstate( selectCurrentNetworkId() ).get();
}

export const useCurrentAddress = () => {
    return useHookstate( selectCurrentAddress() ).get();
}


export const useNetworks = () => {
    const networks = useHookstate( selectNetworks() );
    return networks?.ornull ? Object.values(networks.get()) : [];
}

export const useNetwork = (networkId: string) => {
    const network = useHookstate( selectNetwork(networkId) );
    return network?.ornull ? network.get() : undefined;
}


export const useAccounts = () => {
    const accounts = useHookstate( selectAccounts() );
    return accounts?.ornull ? Object.values(accounts.get()) : [];
}

export const useAccount = (address: string) => {
    const account = useHookstate( selectAccount(address) );
    return account?.ornull ? account.get() : undefined;
}


export const useCoins = () => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const coins = useHookstate(
        selectCoins({
            address: currentAddress.get(),
            networkId: currentNetworkId.get()
        })
    );

    return coins?.ornull ? Object.values(coins.get()) : [];
}

export const useCoin = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const coin = useHookstate(
        selectCoin({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        })
    );

    return coin?.ornull ? coin.get() : undefined;
}

export const useCoinBalance = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const balance = useHookstate(
        selectCoin({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        }).balance
    );

    return balance?.ornull ? balance.get() : undefined;
}


export const useTransactions = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const transactions = useHookstate(
        selectCoinTransactions({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        })
    );

    return transactions?.ornull ? Object.values(transactions.get()) : [];
}

export const useTransaction = (args: {contractId: string, transactionId: string}) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate ( selectCurrentNetworkId() );
    const transaction = useHookstate(
        selectCoinTransaction({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId: args.contractId,
            transactionId: args.transactionId
        })
    );

    return transaction?.ornull ? transaction.get() : undefined;
}


export const useNftCollections = () => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const nftCollections = useHookstate(
        selectNfts({
            address: currentAddress.get(),
            networkId: currentNetworkId.get()
        })
    );

    return nftCollections?.ornull ? Object.values(nftCollections.get()) : [];
}

export const useNftCollection = (contractId: string) => {
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const nftCollection = useHookstate(
        selectNftCollection({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId
        })
    );

    return nftCollection?.ornull ? nftCollection.get() : undefined;
}

export const useNft = (args: {contractId: string, tokenId: string}) => {
    const { contractId, tokenId } = args;
    const currentAddress = useHookstate( selectCurrentAddress() );
    const currentNetworkId = useHookstate( selectCurrentNetworkId() );
    const nft = 
        selectNft({
            address: currentAddress.get(),
            networkId: currentNetworkId.get(),
            contractId,
            tokenId
        })
    

    const [value, setValue] = useState<NFT|undefined>(undefined);

    useEffect(() => {
        if (nft) {
            setValue(nft.get())
        } else {
            setValue(undefined);
        }
    }, [currentAddress, currentNetworkId, nft])

    return value;
}

export const useAddressbook = () => {
    const addressbook = useHookstate( selectAddressBook() );
    return addressbook?.ornull ? Object.values(addressbook.get()) : [];
}

export const useContact = (address: string) => {
    const contact = useHookstate( selectContact(address) );
    return contact?.ornull ? contact.get() : undefined;
}

export const useTheme = () => {
    const storeTheme = useHookstate(UserStore.theme).get();
    const systemTheme = useColorScheme() ?? FALLBACK_THEME;

    if (storeTheme === OS_THEME) {
        return getTheme(systemTheme);
    }

    return getTheme(storeTheme);
}

export const useCurrentSeed = () => {
    return Object.values(EncryptedStore.accounts).filter(w => w.seed.get() !== undefined)[0].seed.get();
}

export const useBiometric = () => {
    return useHookstate(UserStore.biometric).get();
}

export const useCurrentKoin = () => {
    const currentNetwork = useHookstate(UserStore.currentNetworkId);
    return UserStore.networks[currentNetwork.get()].koinContractId.get();
}

export const useRcLimit = () => {
    return useHookstate(UserStore.rcLimit).get();
}

export const useLogs = () => {
    return useHookstate(UserStore.logs).get();
}

export const useSpinner = () => {
    return useHookstate(SpinnerStore).get();
}

export const useLocale = () => {
    return useHookstate(UserStore.locale).get();
}
*/

import { useHookstate } from "@hookstate/core";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import Locales from "../lib/Locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { useEffect, useState } from "react";
import SettingStore from "../stores/SettingStore";
import SecureStore from "../stores/SecureStore";
import AccountStore from "../stores/AccountStore";
import CoinStore from "../stores/CoinStore";
import NetworkStore from "../stores/NetworkStore";
import KapStore from "../stores/KapStore";
import LockStore from "../stores/LockStore";
import SpinnerStore from "../stores/SpinnerStore";
import { NftCollectionStore } from "../stores";

export const useTheme = () => {
    const storeTheme = useHookstate(SettingStore.state.theme).get();
    const systemTheme = useColorScheme() ?? FALLBACK_THEME;

    if (storeTheme === OS_THEME) {
        return getTheme(systemTheme);
    }

    return getTheme(storeTheme);
}

export const useSpinner = () => {
    return useHookstate(SpinnerStore.state).get();
}

const i18n = new I18n(Locales);
export const useI18n = () => {
    let currentLocale = useHookstate(SettingStore.state.locale).get();
    if (currentLocale === OS_LOCALE) {
        const systemLocale = getLocales()[0].languageCode;
        currentLocale = Object.keys(Locales).includes(systemLocale) ?
            systemLocale :
            FALLBACK_LOCALE;
    }

    if (i18n.locale !== currentLocale) {
        i18n.locale = currentLocale;
    }

    return i18n;
}

export const useAppState = () => {
    const appState = useHookstate('active');

    useEffect(() => {
        const appStateListener = AppState.addEventListener(
            'change',
            nextAppState => {
                appState.set(nextAppState);
            },
        );

        return () => {
            appStateListener?.remove();
        };
    }, []);

    return appState.get();
}

export const useAutolock = () => {
    return useHookstate(SettingStore.state.autolock).get();
}

export const useLockState = () => {
    return useHookstate(LockStore.state);
}

export const useAccountValue = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetworkId = useHookstate(SettingStore.state.currentNetworkId).get();
    const coins = useHookstate(CoinStore.state);
    const total = useHookstate(0);

    useEffect(() => {
        const coinList = Object.values(coins.get({ noproxy: true })).filter(coin =>
            coin.networkId === currentNetworkId &&
            coin.accountId === currentAccountId
        );
        if (coinList) {
            for (const coin of coinList) {
                if (coin.balance && coin.price) {
                    total.set(total.get() + coin.balance * coin.price);
                }
            }
        } else {
            total.set(0);
        }
    }, [currentAccountId, currentNetworkId, coins]);

    return total.get();
}

export const useCurrentAccount = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    return AccountStore.state.nested(currentAccountId).get();
}

export const useCurrentNetwork = () => {
    const currentNetworkId = useHookstate(SettingStore.state.currentNetworkId).get();
    return NetworkStore.state.nested(currentNetworkId).get();
}

export const useCurrentAccountId = () => {
    return useHookstate(SettingStore.state.currentAccountId).get();
}

export const useCurrentNetworkId = () => {
    return useHookstate(SettingStore.state.currentNetworkId).get();
}

export const useKapAddress = (address: string) => {
    const name = useHookstate(KapStore.state.nested(address));
    return name?.ornull ? name.get() : undefined;
}

export const useKapName = (name: string) => {
    const store = useHookstate(KapStore.state);
    const address = useHookstate('');
    let foundAddress = '';

    for (const addr in store.get()) {
        if (store.nested(addr).get() === name) {
            foundAddress = addr;
            break;
        }
    }
    address.set(foundAddress);

    return address?.ornull ? address.get() : undefined;
}

export const useHydrated = () => {
    const setting = useHookstate(SettingStore.state);
    const secure = useHookstate(SecureStore.state);
    const account = useHookstate(AccountStore.state);
    const coin = useHookstate(CoinStore.state);
    const network = useHookstate(NetworkStore.state);
    const [state, setState] = useState(false);

    useEffect(() => {
        if (
            setting?.ornull?.get()
            && secure?.ornull?.get()
            && account?.ornull?.get()
            && coin?.ornull?.get()
            && network?.ornull?.get()
        ) {
            setState(true);
        }
    }, [setting, secure, account, coin, network])

    return state;
}

export const useCoins = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetworkId = useHookstate(SettingStore.state.currentAccountId).get();
    const coins = useHookstate(CoinStore.state).get();

    return Object.values(coins).filter(
        coin => coin.networkId === currentNetworkId &&
            coin.accountId === currentAccountId
    );
}

export const useNftCollections = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetworkId = useHookstate(SettingStore.state.currentAccountId).get();
    const nftCollections = useHookstate(NftCollectionStore.state).get();

    return Object.values(nftCollections).filter(nft => 
        nft.networkId === currentNetworkId &&
        nft.accountId === currentAccountId
    );
}

export const useKoinBalance = () => {
    const currentAccountId = useHookstate(SettingStore.state.currentAccountId).get();
    const currentNetwork = useCurrentNetwork();
    const coinId = CoinStore.getters.coinId(currentAccountId, currentNetwork.id, currentNetwork.koinContractId);
    return useHookstate(CoinStore.state.nested(coinId).balance).get() ?? 0;
}