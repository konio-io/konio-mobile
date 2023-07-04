import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { useI18n, useCurrentAddress, useTheme } from "../hooks";
import ResetPassword from "../screens/ResetPassword";
import Unlock from "../screens/Unlock";
import IntroStack from "./IntroStack";
import MainTabsStack from "./MainTabsStack";
import { userStoreIsLoading, encryptedStoreIsLoading, UserStore } from "../stores";
import Loading from "../screens/Loading";
import { executeMigrations } from "../actions";

const Stack = createStackNavigator();
export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { Color, Border, FontFamily } = theme.vars;
  const currentAddress = useCurrentAddress();
  
  if (userStoreIsLoading.get() || encryptedStoreIsLoading.get()) {
    return <Loading/>;
  }

  executeMigrations();

  if (!currentAddress.get()) {
    return <IntroStack />;
  }

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
        name="MainTabs"
        component={MainTabsStack}
        options={{
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="Unlock"
        component={Unlock}
        options={{
          presentation: 'modal',
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: i18n.t('reset_password')
        }}
      />
    </Stack.Navigator>
  );
}