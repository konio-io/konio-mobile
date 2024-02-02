
import SettingStore, { SETTING_STORE_DEFAULT } from './SettingStore';
import ContactStore from './ContactStore';
import AccountStore from './AccountStore';
import SecureStore from './SecureStore';
import CoinStore from './CoinStore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoSecureStore from 'expo-secure-store';
import { none } from '@hookstate/core';
import NftStore from './NftStore';
import { utils } from 'koilib';

export const migrations: Record<string, Function> = {
    '20231003': async () => {
        const userStore = JSON.parse(await AsyncStorage.getItem('store') ?? '{}');
        const encryptedStore = JSON.parse(await ExpoSecureStore.getItemAsync('encryptedStore') ?? '{}');

        const store = {
            setting: {},
            account: {},
            secure: {
                accounts: {},
                password: ''
            },
            coin: {},
            contact: {}
        };

        store.setting.currentAccountId = userStore.currentAddress;
        store.setting.currentNetworkId = userStore.currentNetworkId;
        store.setting.locale = userStore.locale;
        store.setting.theme = userStore.theme;
        store.setting.biometric = userStore.biometric;
        store.setting.autolock = userStore.autolock;

        store.contact = userStore.addressbook ?? {};

        const secure = encryptedStore;
        for (const accountSecure of Object.values(secure.accounts)) {
            store.secure.accounts[accountSecure.address] = {
                id: accountSecure.address,
                ...accountSecure
            }
        }
        store.secure.password = secure.password;

        for (const account of Object.values(userStore.accounts)) {
            store.account[account.address] = {
                id: account.address,
                address: account.address,
                name: account.name
            }

            for (const contractId of account.coins) {
                const coin = userStore.coins[contractId];
                const coinId = CoinStore.getters.coinId(account.address, coin.networkId, contractId);

                store.coin[coinId] = {
                    id: coinId,
                    contractId,
                    networkId: coin.networkId,
                    accountId: account.address,
                    symbol: coin.symbol,
                    decimal: coin.decimal,
                }
            }
        }

        SettingStore.state.merge(store.setting);
        AccountStore.state.merge(store.account);
        SecureStore.state.merge(store.secure);
        CoinStore.state.merge(store.coin);
        ContactStore.state.merge(store.contact);
    },
    '20231004': async () => {
        await AsyncStorage.removeItem('store');
        await ExpoSecureStore.deleteItemAsync('encryptedStore');
        await CoinStore.actions.refreshCoins({ info: true });
    },
    '20231223': async () => {
        SettingStore.state.maxMana.set(SETTING_STORE_DEFAULT.maxMana);
        SettingStore.state.rcLimit.set(none);
    },
    '20240204': async () => {
        const nfts = NftStore.state.get();

        for (const nftId of Object.keys(nfts)) {
            const tokenId = NftStore.state.nested(nftId).tokenId.get();
            NftStore.state.nested(nftId).merge({
                tokenId: "0x" + utils.toHexString(new TextEncoder().encode(tokenId))
            });
        }
    }
}

export const executeMigration = async () => {
    const sortedMigrations = Object.keys(migrations).sort();
    const currentVersion = SettingStore.state.version.get();
    const migrationsToExecute = [];

    for (const date of sortedMigrations) {
        if (currentVersion < date) {
            migrationsToExecute.push(date);
        }
    }

    if (migrationsToExecute.length > 0) {
        for (const date of migrationsToExecute) {
            try {
                await migrations[date]();
                SettingStore.state.version.set(date);
            } catch (e) {
                let error = e instanceof Error ? e.message : String(e);
                throw `${date} - ${error}`;
            }
        }
    }
}