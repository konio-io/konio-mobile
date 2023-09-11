import { useHookstate } from "@hookstate/core";
import { UserStore, EncryptedStore, LockStore, WCStore, KapStore, SpinnerStore } from "../stores";
import { getTheme } from "../themes";
import { AppState, useColorScheme } from 'react-native';
import Locales from "../lib/Locales";
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { FALLBACK_LOCALE, FALLBACK_THEME, OS_LOCALE, OS_THEME } from "../lib/Constants";
import { useEffect } from "react";
import { logError, refreshWCActiveSessions, setWCPendingProposal, setWCPendingRequest, showToast, walletConnectInit, walletConnectPair } from "../actions";
import { SignClientTypes } from "@walletconnect/types";

export const useNetworks = () => {
    return useHookstate(UserStore.networks);
}

export const useAccounts = () => {
    return useHookstate(UserStore.accounts);
}

export const useNetwork = (networkId: string) => {
    return useHookstate(UserStore.networks[networkId]);
}

export const useCurrentNetworkId = () => {
    return useHookstate(UserStore.currentNetworkId);
}

export const useCurrentAddress = () => {
    return useHookstate(UserStore.currentAddress);
}

export const useAccount = (address: string) => {
    return useHookstate(UserStore.accounts[address]);
}

export const useCoin = (contractId: string) => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    return useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].coins[contractId]);
}

/**
 * Current account coins
 * @returns 
 */
export const useCoins = () => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    return useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].coins);
}


/**
 * Current account/network/coin transactions
 * @param contractId 
 * @returns 
 */
export const useTransactions = (contractId: string) => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    const coin = UserStore.accounts
        .nested(currentAddress)
        .assets
        .nested(currentNetworkId)
        .coins
        .nested(contractId);

    return useHookstate(coin.transactions);
}

export const useTransaction = (args: {contractId: string, transactionId: string}) => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    const transactions = UserStore.accounts
        .nested(currentAddress)
        .assets
        .nested(currentNetworkId)
        .coins
        .nested(args.contractId)
        .transactions;

    return useHookstate(transactions[args.transactionId]);
}

export const usePassword = () => {
    return useHookstate(EncryptedStore.password);
}

export const useAddressbook = () => {
    return useHookstate(UserStore.addressbook);
}

export const useContact = (address: string) => {
    return useHookstate(UserStore.addressbook[address]);
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
    return Object.values(EncryptedStore.accounts).filter(w => w.seed.get() !== undefined)[0].seed;
}

const i18n = new I18n(Locales);
export const useI18n = () => {
    let currentLocale = useHookstate(UserStore.locale).get();
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

export const useBiometric = () => {
    return useHookstate(UserStore.biometric);
}

export const useCurrentKoin = () => {
    const currentNetwork = useHookstate(UserStore.currentNetworkId);
    return UserStore.networks[currentNetwork.get()].koinContractId;
}

export const useAutolock = () => {
    return useHookstate(UserStore.autolock);
}

export const useRcLimit = () => {
    return useHookstate(UserStore.rcLimit);
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

    return appState;
}

export const useWC = () => {
    return useHookstate(WCStore);
}

export const useLogs = () => {
    return useHookstate(UserStore.logs);
}

export const useLock = () => {
    return useHookstate(LockStore);
}

export const useKapAddress = (address: string) => {
    const store = useHookstate(KapStore);
    const name = useHookstate<string | null>(null);
    if (store[address].ornull) {
        name.set(`${store[address].get()}`);
    } else {
        name.set(null);
    }

    return name;
}

export const useKapName = (name: string) => {
    const store = useHookstate(KapStore);
    const address = useHookstate('');
    let foundAddress = '';

    for (const addr in store.get()) {
        if (store[addr].get() === name) {
            foundAddress = addr;
            break;
        }
    }
    address.set(foundAddress);

    return address;
}


/**
 * Current account nfts
 * @returns 
 */
export const useNfts = () => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useCurrentNetworkId().get();

    return useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].nfts);
}

export const useNftCollection = (contractId: string) => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    return useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].nfts[contractId]);
}

export const useNft = (args: {contractId: string, tokenId: string}) => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    return useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].nfts[args.contractId].tokens[args.tokenId]);
}

export const useAccountValue = () => {
    const currentAddress = useHookstate(UserStore.currentAddress).get();
    const currentNetworkId = useHookstate(UserStore.currentNetworkId).get();
    const coins = useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].coins);
    const total = useHookstate(0);

    useEffect(() => {
        total.set(0);
        if (coins.get()) {
            for (const contractId in coins) {
                const balance = coins[contractId].balance.get();
                const price = coins[contractId].price.get();
    
                if (balance && price) {
                    total.set(total.get() + balance * price);
                }
            }
        }
    }, [currentAddress, currentNetworkId, coins]);

    return total;
}

export const useSpinner = () => {
    return useHookstate(SpinnerStore);
}


export const useWalletConnectHandler = async () => {
    const WC = useHookstate(WCStore);

    const registerEvents = () => {
        const wallet = WC.wallet.get();
        if (wallet) {
            console.log('wc_register_events');

            const onSessionProposal = (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
                console.log('wc_proposal', proposal);
                setWCPendingProposal(proposal);
            }
        
            const onSessionRequest = async (request: SignClientTypes.EventArguments["session_request"]) => {
                console.log('wc_request', request);
                setWCPendingRequest(request);
            }

            wallet.on("session_proposal", onSessionProposal);
            wallet.on("session_request", onSessionRequest);
            wallet.on("session_delete", () => {
                refreshWCActiveSessions();
            });
        }
    }

    useEffect(() => {
        if (WC.wallet.ornull && WC.uri.ornull) {
            const WCUri = WC.uri.ornull.get({noproxy: true});
                walletConnectPair(WCUri)
                .then(() => {
                    console.log('wc_pair: paired');
                })
                .catch(e => {
                    logError(e);
                    showToast({
                        type: 'error',
                        text1: i18n.t('pairing_error'),
                        text2: i18n.t('check_logs')
                    });
                });
        }
    }, [WC.uri, WC.wallet]);

    useEffect(() => {
        registerEvents();
    }, [WC.wallet]);

    useEffect(() => {
        walletConnectInit();
    }, []);
}