import { registerRootComponent } from 'expo';

import App from './App';
import {
    AccountStore,
    CoinStore,
    ContactStore,
    NameserverStore,
    KoinStore,
    LockStore,
    LogStore,
    ManaStore,
    NetworkStore,
    NftCollectionStore,
    NftStore,
    SecureStore,
    SettingStore,
    SpinnerStore,
    WalletConnectStore,
    TransactionStore,
    PayerStore
} from './stores';
import { registerStore } from './stores/registry';

registerStore('Account', AccountStore);
registerStore('Setting', SettingStore);
registerStore('Setting', SettingStore);
registerStore('Account', AccountStore);
registerStore('Network', NetworkStore);
registerStore('Secure', SecureStore);
registerStore('Contact', ContactStore);
registerStore('Coin', CoinStore);
registerStore('NftCollection', NftCollectionStore);
registerStore('Nft', NftStore);
registerStore('Log', LogStore);
registerStore('Spinner', SpinnerStore);
registerStore('Nameserver', NameserverStore);
registerStore('Mana', ManaStore);
registerStore('WalletConnect', WalletConnectStore);
registerStore('Koin', KoinStore);
registerStore('Lock', LockStore);
registerStore('Transaction', TransactionStore);
registerStore('Payer', PayerStore);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
