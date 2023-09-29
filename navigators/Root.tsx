import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ResetPassword from "../screens/ResetPassword";
import Account from "./Account";
import Settings from "./Settings";
import NewAccount from "../screens/NewAccount";
import ImportAccount from "../screens/ImportAccount";
import EditAccount from "../screens/EditAccount";
import WalletConnect from "./WalletConnect";
import { RootParamList } from "../types/navigation";
import Faq from "../screens/Faq";
import About from "../screens/About";
import { useI18n, useTheme } from "../hooks";

const Stack = createStackNavigator<RootParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { Color, FontFamily } = theme.vars;
  
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: Color.base
      },
      headerTitleStyle: {
        fontFamily: FontFamily.sans,
        color: Color.baseContrast
      },
      headerTintColor: Color.primary,
      headerShadowVisible: false,
      headerBackTitleVisible: false
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