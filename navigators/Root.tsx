import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useCallback } from "react";
import { useI18n, useTheme, useW3W } from "../hooks";
import ResetPassword from "../screens/ResetPassword";
import Unlock from "../screens/Unlock";
import Account from "./Account";
import Settings from "./Settings";
import NewAccount from "../screens/NewAccount";
import EditAccount from "../screens/EditAccount";
import WalletConnect from "./WalletConnect";
import { RootNavigationProp, RootParamList } from "../types/navigation";
import { SignClientTypes } from "@walletconnect/types";
import { createW3W } from "../actions";
import { useNavigation } from "@react-navigation/native";
import WcProposal from "../screens/WcProposal";
import WcRequest from "../screens/WcRequest";

const Stack = createStackNavigator<RootParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { Color, Border, FontFamily } = theme.vars;
  const W3W = useW3W();
  const navigation = useNavigation<RootNavigationProp>();

  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
      navigation.navigate('WcProposal', { proposal });
    },
    []
  );

  const onSessionRequest = useCallback(
    async (request: SignClientTypes.EventArguments["session_request"]) => {
      navigation.navigate('WcRequest', { request });
    },
    []
  );

  useEffect(() => {
    if (!W3W.get()) {
      createW3W(onSessionProposal, onSessionRequest);
    }
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