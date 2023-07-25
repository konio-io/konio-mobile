import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { useAppState, useAutolock, useI18n, useLock, useTheme, useWC } from "../hooks";
import ResetPassword from "../screens/ResetPassword";
import Unlock from "../screens/Unlock";
import Account from "./Account";
import Settings from "./Settings";
import NewAccount from "../screens/NewAccount";
import EditAccount from "../screens/EditAccount";
import WalletConnect from "./WalletConnect";
import { RootNavigationProp, RootParamList } from "../types/navigation";
import { acceptRequest, initWC, logError, showToast } from "../actions";
import { StackActions, useNavigation } from "@react-navigation/native";
import WcProposal from "../screens/WcProposal";
import WcRequest from "../screens/WcRequest";
import { WC_SECURE_METHODS } from "../lib/Constants";
import { useHookstate } from "@hookstate/core";

const Stack = createStackNavigator<RootParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { Color, Border, FontFamily } = theme.vars;
  const navigation = useNavigation<RootNavigationProp>();
  const lock = useLock();
  const nextAppState = useAppState();
  const dateLock = useHookstate(0);
  const autoLock = useAutolock();
  const WC = useWC();
  
  useEffect(() => {
    if (lock.get() === true) {
      dateLock.set(0); //ios
      navigation.navigate('Unlock');
      return;
    }
    
    if (navigation.getState()) {
      const popAction = StackActions.pop(1);
      navigation.dispatch(popAction);
      return;
    }

    navigation.navigate('Root');
  }, [lock]);

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

    navigation.navigate('WcProposal', { proposal });
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
        acceptRequest(request)
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

    navigation.navigate('WcRequest', { request });
  }, [lock, WC.pendingRequest]);

  useEffect(() => {
    initWC();
  }, []);

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
        name="EditAccount"
        component={EditAccount}
        options={{
          title: i18n.t('edit_account')
        }}
      />
      <Stack.Screen
        name="Unlock"
        component={Unlock}
        options={{
          presentation: 'modal',
          headerShown: false
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
        name="WcProposal"
        component={WcProposal}
        options={{
          title: i18n.t('wc_proposal'),
          presentation: 'modal',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="WcRequest"
        component={WcRequest}
        options={{
          title: i18n.t('wc_request'),
          presentation: 'modal',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}