import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { useI18n, useCurrentAddress, useTheme } from "../hooks";
import ResetPassword from "../screens/ResetPassword";
import Unlock from "../screens/Unlock";
import IntroStack from "./IntroStack";
import MainTabsStack from "./MainTabsStack";
import { SheetProvider } from "react-native-actions-sheet";
import { StatusBar } from 'expo-status-bar';
import { Toast } from "../components";

const Stack = createStackNavigator();
export default () => {
  const theme = useTheme();
  const i18n = useI18n();
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;
  const currentAddress = useCurrentAddress();

  return (
    <NavigationContainer theme={navigationTheme}>
      <PolyfillCrypto />

      {!currentAddress.get() &&
        <IntroStack />
      }

      {currentAddress.get() &&
        <SheetProvider>
          <Stack.Navigator>
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
        </SheetProvider>
      }

      <StatusBar style={theme.statusBarStyle} />
      <Toast />

    </NavigationContainer>
  );
}