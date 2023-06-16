import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import "@ethersproject/shims"; //needs for etherjs compatibility

import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Toast } from './components';
import { WalletStack, SettingStack, IntroStack, Unlock, Unavailable, Loading } from './screens';
import { useCurrentAddress, usePassword, useTheme } from './hooks';
import { useHookstate } from '@hookstate/core';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
  });

  const loaded = fontsLoaded;
  //const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      {loaded ? <LoadedApp /> : <Loading />}
    </SafeAreaProvider>
  );
}

const LoadedApp = () => {
  const currentAddress = useCurrentAddress();
  const unlock = useHookstate(false);
  const password = usePassword();
  const theme = useTheme().get();
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;
  const insets = useSafeAreaInsets();
  const styles = theme.styles;

  return (
    <NavigationContainer theme={navigationTheme}>

      <PolyfillCrypto />

      {!currentAddress.get() &&
        <IntroStack />
      }

      {currentAddress.get() && (unlock.get() === true || password.get() === '') &&
        <View
          style={{
            ...styles.wrapperFull,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            flex: 1,
          }}>
          <Tabs />
        </View>
      }

      {currentAddress.get() && unlock.get() === false && password.get() !== '' &&
        <Unlock unlockState={unlock}></Unlock>
      }

      <StatusBar style="auto" />
      <Toast />
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();
const Tabs = () => {
  const theme = useTheme().get();
  const { Color, FontFamily, Border } = theme.vars;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Color.primary,
        tabBarInactiveTintColor: Color.baseContrast,
        tabBarLabelStyle: { fontFamily: FontFamily.sans },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Color.base,
          borderTopColor: Border.color,
          borderTopWidth: Border.width
        },
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
      }}
    >
      <Tab.Screen
        name="WalletStack"
        component={WalletStack}
        options={{
          title: 'Wallet',
          header: () => (<View />),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="wallet" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen name="Swap"
        component={Unavailable}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="swap" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Dapps"
        component={Unavailable}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          title: 'Settings',
          header: () => (<View />),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

