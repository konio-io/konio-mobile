
import SettingStore from './SettingStore';
import ContactStore from './ContactStore';
import NetworkStore from './NetworkStore';
import { DEFAULT_NETWORKS } from '../lib/Constants';
import AccountStore from './AccountStore';
import SecureStore from './SecureStore';
import CoinStore from './CoinStore';
import { UserStore, EncryptedStore } from './OldStore';

const migrations: Record<string, Function> = {
    '20231003': () => {
        const store = {
            setting: {},
            network: {},
            account: {},
            secure: {
                accounts: {},
                password: ''
            },
            coin: {},
            contact: {}
        };

        store.setting.currentAccountId = UserStore.currentAddress.get({noproxy: true});
        store.setting.currentNetworkId = UserStore.currentNetworkId.get({noproxy: true});
        store.setting.locale = UserStore.locale.get({noproxy: true});
        store.setting.theme = UserStore.theme.get({noproxy: true});
        store.setting.biometric = UserStore.biometric.get({noproxy: true});
        store.setting.autolock = UserStore.autolock.get({noproxy: true});

        store.contact = UserStore.addressbook.get({noproxy: true});

        store.network = DEFAULT_NETWORKS;

        const secure = EncryptedStore.get({noproxy: true});
        for (const accountSecure of Object.values(secure.accounts)) {
            store.secure.accounts[accountSecure.address] = {
                id: accountSecure.address,
                ...accountSecure
            }
        }
        store.secure.password = secure.password;

        
        for (const account of Object.values(UserStore.accounts.get({noproxy: true}))) {
            store.account[account.address] = {
                id: account.address,
                address: account.address,
                name: account.name
            }
            
            for (const contractId of account.coins) {
                const coin = UserStore.coins[contractId].get({noproxy: true});
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
        NetworkStore.state.set(store.network);
        AccountStore.state.set(store.account);
        SecureStore.state.set(store.secure);
        CoinStore.state.set(store.coin);
        ContactStore.state.set(store.contact);
    }
}

export const executeMigration = () => {
    const sortedMigrations = Object.keys(migrations).sort();
    const latestVersion = sortedMigrations.reverse()[0];
    const currentVersion = SettingStore.state.version.get();
    const migrationsToExecute = [];
    
    if (currentVersion < latestVersion) {
        for (const date of sortedMigrations) {
            if (currentVersion < date) {
                migrationsToExecute.push(date);
            }
        }
    }
    
    if (migrationsToExecute.length > 0) {
        for (const date of migrationsToExecute.reverse()) {
            migrations[date]();
            SettingStore.state.version.set(date);
        }
    }
}