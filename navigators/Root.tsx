import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { useI18n, useTheme } from "../hooks";
import ResetPassword from "../screens/ResetPassword";
import Unlock from "../screens/Unlock";
import Account from "./Account";
import Settings from "./Settings";
import NewAccount from "../screens/NewAccount";
import EditAccount from "../screens/EditAccount";
import WalletConnect from "./WalletConnect";
import { RootParamList } from "../types/navigation";

const Stack = createStackNavigator<RootParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { Color, Border, FontFamily } = theme.vars;

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
    </Stack.Navigator>
  );
}