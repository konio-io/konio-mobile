import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { useAppState, useAutolock, useI18n, useLock, useTheme, useWC } from "../hooks";
import ResetPassword from "../screens/ResetPassword";
import Account from "./Account";
import Settings from "./Settings";
import NewAccount from "../screens/NewAccount";
import ImportAccount from "../screens/ImportAccount";
import EditAccount from "../screens/EditAccount";
import WalletConnect from "./WalletConnect";
import { RootNavigationProp, RootParamList } from "../types/navigation";
import { walletConnectAcceptRequest, logError, refreshWCActiveSessions, showToast } from "../actions";
import { useNavigation } from "@react-navigation/native";
import { WC_SECURE_METHODS } from "../lib/Constants";
import { useHookstate } from "@hookstate/core";
import NetInfo from '@react-native-community/netinfo';
import Faq from "../screens/Faq";
import About from "../screens/About";
import { SheetManager } from "react-native-actions-sheet";

const Stack = createStackNavigator<RootParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { Color, Border, FontFamily } = theme.vars;
  const lock = useLock();
  const nextAppState = useAppState();
  const dateLock = useHookstate(0);
  const autoLock = useAutolock();
  const WC = useWC();
  const connectionAvailable = useHookstate(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (connectionAvailable.get() === false && state.isConnected === true) {
        showToast({
          type: 'success',
          text1: i18n.t('you_online')
        });
        refreshWCActiveSessions();
      }
      else if (state.isConnected !== true) {
        showToast({
          type: 'error',
          text1: i18n.t('you_offline'),
          text2: i18n.t('check_connection')
        });
      }
  
      connectionAvailable.set(state.isConnected === true ? true : false);
    });

    return unsubscribe;
  }, []);

  //lock sheet
  useEffect(() => {
    if (lock.get() === true) {
      dateLock.set(0); //ios
      setTimeout(() => {
        SheetManager.show('unlock');
      }, 100);
    }
  }, [lock]);
  
  //autolock
  useEffect(() => {
    if (autoLock.get() > -1) {
      if (nextAppState.get() === 'background') {
        dateLock.set(Date.now() + autoLock.get() + 1000);
      }
      else if (nextAppState.get() === 'active') {
        if (dateLock.get() > 0 && Date.now() > dateLock.get()) {
          lock.set(true);
        }
      }
    }
  }, [nextAppState, autoLock]);
  
  useEffect(() => {
    if (lock.get() === true) {
      return;
    }

    const pendingProposal = WC.pendingProposal.get({noproxy: true});
    if (!pendingProposal) {
      return;
    }

    const proposal = Object.assign({}, pendingProposal);

    SheetManager.show('wc_proposal', { payload: {proposal} });
  }, [lock, WC.pendingProposal]);

  useEffect(() => {
    if (lock.get() === true) {
      return;
    }

    const pendingRequest = WC.pendingRequest.get({noproxy: true});
    if (!pendingRequest) {
      return;
    }

    const request = Object.assign({}, pendingRequest);

    const method = request.params.request.method;
    if (!WC_SECURE_METHODS.includes(method)) {
        walletConnectAcceptRequest(request)
            .catch(e => {
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('dapp_request_error', { method }),
                    text2: i18n.t('check_logs')
                })
            });
        return;
    }

    SheetManager.show('wc_request', { payload: {request} });
  }, [lock, WC.pendingRequest]);

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: Color.base,
        borderBottomColor: Border.color,
        borderBottomWidth: Border.width
      },
      headerTitleStyle: {
        fontFamily: FontFamily.sans,
        color: Color.baseContrast
      },
      headerTintColor: Color.primary
    }}>
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="NewAccount"
        component={NewAccount}
        options={{
          title: i18n.t('add_account')
        }}
      />
      <Stack.Screen
        name="ImportAccount"
        component={ImportAccount}
        options={{
          title: i18n.t('import_account')
        }}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{
          title: i18n.t('edit_account')
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: i18n.t('reset_password')
        }}
      />
      <Stack.Screen
        name="WalletConnect"
        component={WalletConnect}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Faq"
        component={Faq}
        options={{
          title: i18n.t('faq')
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          title: i18n.t('about')
        }}
      />
    </Stack.Navigator>
  );
}