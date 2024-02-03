import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import '@ethersproject/shims'; //needs for etherjs compatibility
import './actionSheets';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer, useNavigation } from "@react-navigation/native";
import { SheetProvider } from "react-native-actions-sheet";
import Intro from './navigators/Intro';
import Spinner from './components/Spinner';
import Drawer from './navigators/Drawer';
import { useCallback, useEffect, useState } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import { WC_SECURE_METHODS } from './lib/Constants';
import NetInfo from '@react-native-community/netinfo';
import { SignClientTypes } from "@walletconnect/types";
import { useI18n, useTheme, useLockState, useAppState, useAutolock, useCurrentAccountId, useNeedMigration } from './hooks';
import { useHookstate } from '@hookstate/core';
import { Toast as MyToast } from './components';
import { View } from 'react-native';
import { useHydrated } from './hooks';
import { CoinStore, WalletConnectStore, LogStore, ManaStore, PayerStore, NftStore } from './stores';
import Toast from 'react-native-toast-message';
import Migration from './screens/Migration';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import Unlock from './components/Unlock';
import { SettingsNavigationProp } from './types/navigation';

export default function App() {
  const theme = useTheme();
  const [fontsLoaded] = useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
    'Poppins_bold': require('./assets/Poppins_bold.otf')
  });
  const hydrated = useHydrated();
  const needMigration = useNeedMigration(hydrated);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded && hydrated) {
      setAppIsReady(true);
    }
  }, [fontsLoaded, hydrated]);

  // @ts-ignore
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;

  const onReady = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (needMigration) {
    return <Migration />;
  }

  return (
    //@ts-ignore
    <NavigationContainer theme={navigationTheme} onReady={onReady}>
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
    return <Intro />
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
  const url = Linking.useURL();
  const settingNavigation = useNavigation<SettingsNavigationProp>();

  //
  /**
   * intercept walletConnect mobile linking
   * android: wc://$uri
   * ios: konio://wc?uri=$uri, https://konio.io/wc?uri=$uri
   */
  useEffect(() => {
    let wcUri = '';

    if (url?.startsWith('konio://wc?uri=')) {
      wcUri = url.replace('konio://wc?uri=', '');
      wcUri = decodeURIComponent(wcUri);
    }
    else if (url?.startsWith('konio.io://wc?uri=')) {
      wcUri = url.replace('konio.io://wc?uri=', '');
      wcUri = decodeURIComponent(wcUri);
    }
    else if (url?.startsWith('https://konio.io/wc?uri=')) {
      wcUri = url.replace('https://konio.io/wc?uri=', '');
      wcUri = decodeURIComponent(wcUri);
    }
    else if (url?.startsWith('wc:')) {
      wcUri = url;
    }

    if (wcUri.includes('symKey=')) {
      WalletConnectStore.actions.setUri(wcUri);
    }
  }, [url]);

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
            text2: i18n.t('check_logs'),
            onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
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
        if (WC_SECURE_METHODS.includes(method)) {
          SheetManager.show('wc_request', { payload: { request } });
        } else {
          WalletConnectStore.actions.acceptRequest(request)
            .catch(e => {
              LogStore.actions.logError(e);
              Toast.show({
                type: 'error',
                text1: i18n.t('dapp_request_error', { method }),
                text2: i18n.t('check_logs'),
                onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
              })
            });
        }
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
    NftStore.actions.refreshTokens();
    ManaStore.actions.refreshMana();
    PayerStore.actions.refreshPayers();
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

  //intercept autolock
  useEffect(() => {
    if (autoLock > -1) {
      if (nextAppState === 'background') {
        setDateLock(Date.now() + autoLock + 1000);
      }
      else if (nextAppState === 'active') {
        if (dateLock > 0 && Date.now() > dateLock) {
          setDateLock(0);
          lock.set(true);
        }
      }
    }
  }, [nextAppState, autoLock, lock]);

  if (lock.get() === true) {
    return (
      <Unlock></Unlock>
    );
  }

  return <></>;
}
