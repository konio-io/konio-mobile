import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import '@ethersproject/shims'; //needs for etherjs compatibility
import './actionSheets';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer, getStateFromPath } from "@react-navigation/native";
import { SheetProvider } from "react-native-actions-sheet";
import Loading from './screens/Loading';
import Intro from './navigators/Intro';
import Spinner from './components/Spinner';
import Drawer from './navigators/Drawer';
import { useEffect, useState } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import { WC_SECURE_METHODS } from './lib/Constants';
import NetInfo from '@react-native-community/netinfo';
import { SignClientTypes } from "@walletconnect/types";
import { useI18n, useTheme, useLockState, useAppState, useAutolock, useCurrentAccountId } from './hooks';
import { useHookstate } from '@hookstate/core';
import { Toast as MyToast } from './components';
import { View } from 'react-native';
import { useHydrated } from './hooks';
import { CoinStore, WalletConnectStore, LogStore, ManaStore, SecureStore } from './stores';
import Toast from 'react-native-toast-message';
import { needMigration } from './stores/migrations';
import Migration from './screens/Migration';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
    'Poppins_bold': require('./assets/Poppins_bold.otf')
  });

  const hydrated = useHydrated();
  if (!hydrated || !fontsLoaded) {
    return <Loading/>;
  }
 
  if (needMigration()) {
    return <Migration/>;
  }

  return <Loaded/>;
}

const Loaded = () => {
  const theme = useTheme();

  // @ts-ignore
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;

  const linking = {
    prefixes: ['wc://', 'konio://'],
    config: {
      screens: {
        Root: {
          initialRouteName: 'Account',
          screens: {
            Account: 'account',
            Settings: 'settings'
          }
        }
      }
    },
    getStateFromPath: (path: string, options: any) => {
      if (path.includes('@2') && !path.includes('requestId')) {
        WalletConnectStore.actions.setUri(`wc:${path}`);
      }

      return getStateFromPath(path, options);
    },
  };

  return (
    //@ts-ignore
    <NavigationContainer theme={navigationTheme} linking={linking} fallback={<Loading />}>
      <PolyfillCrypto />

      <SheetProvider>
        <Main />
      </SheetProvider>

      <StatusBar style={theme.statusBarStyle} />
      <MyToast />
      <Spinner />
    </NavigationContainer>
  );
}

const Main = () => {
  const currentAccountId = useCurrentAccountId();

  if (currentAccountId === '') {
    return <Intro/>
  }

  return (
    <View style={{ flex: 1 }}>
      <Init />
      <Lock />
      <Drawer />
      <Wc />
    </View>
  )
}

const Wc = () => {
  const uri = useHookstate(WalletConnectStore.state.uri).get();
  const wallet = useHookstate(WalletConnectStore.state.wallet).get();
  const i18n = useI18n();

  //intercept walletconnectStore wallet/uri set
  useEffect(() => {
    if (wallet && uri) {
      WalletConnectStore.actions.pair(uri)
        .then(() => {
          console.log('wc_pair: paired');
        })
        .catch(e => {
          LogStore.actions.logError(e);
          Toast.show({
            type: 'error',
            text1: i18n.t('pairing_error'),
            text2: i18n.t('check_logs')
          });
        });
    }
  }, [uri, wallet]);

  //intercept walletconnectStore set and subscribe events
  useEffect(() => {
    if (wallet) {
      console.log('wc_register_events');

      const onSessionProposal = (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
        console.log('wc_proposal', proposal);
        SheetManager.show('wc_proposal', { payload: { proposal: Object.assign({}, proposal) } });
      }

      const onSessionRequest = async (request: SignClientTypes.EventArguments["session_request"]) => {
        console.log('wc_request', request);
        const method = request.params.request.method;
        if (!WC_SECURE_METHODS.includes(method)) {
          WalletConnectStore.actions.acceptRequest(request)
            .catch(e => {
              LogStore.actions.logError(e);
              Toast.show({
                type: 'error',
                text1: i18n.t('dapp_request_error', { method }),
                text2: i18n.t('check_logs')
              })
            });
          return;
        }
        SheetManager.show('wc_request', { payload: { request } });
      }

      wallet.on("session_proposal", onSessionProposal);
      wallet.on("session_request", onSessionRequest);
      wallet.on("session_delete", () => {
        WalletConnectStore.actions.refreshActiveSessions();
      });
    }
  }, [wallet]);

  return <></>
}

const Init = () => {
  const [connectionAvailable, setConnectionAvailable] = useState(true);
  const i18n = useI18n();

  //Refresh coins and mana on init
  useEffect(() => {
    CoinStore.actions.refreshCoins({ balance: true, price: true });
    ManaStore.actions.refreshMana();
    WalletConnectStore.actions.init();

    //network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (connectionAvailable === false && state.isConnected === true) {
        Toast.show({
          type: 'success',
          text1: i18n.t('you_online')
        });
        WalletConnectStore.actions.refreshActiveSessions();
      }
      else if (state.isConnected !== true) {
        Toast.show({
          type: 'error',
          text1: i18n.t('you_offline'),
          text2: i18n.t('check_connection')
        });
      }
      setConnectionAvailable(state.isConnected === true ? true : false);
    });

    return unsubscribe;
  }, [])

  return <></>
}

const Lock = () => {
  const lock = useLockState();
  const [dateLock, setDateLock] = useState(0);
  const nextAppState = useAppState();
  const autoLock = useAutolock();

  //intercept lock
  useEffect(() => {
    if (lock.get() === true) {
      setDateLock(0); //ios
      setTimeout(() => {
        SheetManager.show('unlock');
      }, 100);
    }
  }, [lock]);

  //intercept autolock
  useEffect(() => {
    if (autoLock > -1) {
      if (nextAppState === 'background') {
        setDateLock(Date.now() + autoLock + 1000);
      }
      else if (nextAppState === 'active') {
        if (dateLock > 0 && Date.now() > dateLock) {
          lock.set(true);
        }
      }
    }
  }, [nextAppState, autoLock, lock]);

  return <></>
}
