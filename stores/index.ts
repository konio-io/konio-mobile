import { useSecureStore, SecureStoreLoaded } from "./SecureStore";
import { useSettingStore, SettingStoreLoaded } from "./SettingStore";
import { useAccountStore, AccountStoreLoaded } from "./AccountStore";
import { useCoinStore, CoinStoreLoaded } from "./CoinStore";
import { useNetworkStore, NetworkStoreLoaded } from "./NetworkStore";
import { useContactStore } from "./ContactStore";
import { useNftCollectionStore } from "./NftCollectionStore";
import { useNftStore } from "./NftStore";
import { useSpinnerStore } from "./SpinnerStore";
import { useWalletConnectStore } from "./WalletConnectStore";
import { useKapStore } from "./KapStore";
import { useKoinStore } from "./KoinStore";
import { useLockStore } from "./LockStore";
import { useManaStore } from "./ManaStore";
import { Store } from "./types";
import { useHookstate } from "@hookstate/core";

export const useStore = () : Store => {
    return {
        Setting: useSettingStore(useStore),
        Account: useAccountStore(useStore),
        Network: useNetworkStore(useStore),
        Secure: useSecureStore(useStore),
        Contact: useContactStore(useStore),
        Coin: useCoinStore(useStore),
        NftCollection: useNftCollectionStore(useStore),
        Nft: useNftStore(useStore),
        Spinner: useSpinnerStore(useStore),
        Kap: useKapStore(useStore),
        Mana: useManaStore(useStore),
        WalletConnect: useWalletConnectStore(useStore),
        Koin: useKoinStore(useStore),
        Lock: useLockStore(useStore)
    };
};

export const useStoreLoaded = () => {
    return (
        useHookstate(SettingStoreLoaded).get()
        && useHookstate(SecureStoreLoaded).get()
        && useHookstate(AccountStoreLoaded).get()
        && useHookstate(CoinStoreLoaded).get()
        && useHookstate(NetworkStoreLoaded).get()
    );
}