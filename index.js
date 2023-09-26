import { registerRootComponent } from 'expo';

import App from './App';
import {
    AccountStore,
    CoinStore,
    ContactStore,
    KapStore,
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
    WalletConnectStore
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
registerStore('Kap', KapStore);
registerStore('Mana', ManaStore);
registerStore('WalletConnect', WalletConnectStore);
registerStore('Koin', KoinStore);
registerStore('Lock', LockStore);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
