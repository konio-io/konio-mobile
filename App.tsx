import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import "@ethersproject/shims"; //needs for etherjs compatibility

import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Toast } from './components';
import { WalletStack, SettingStack, IntroStack, Unavailable, Loading, Unlock } from './screens';
import { useCurrentAddress, useLocker, useTheme } from './hooks';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import i18n from './locales';

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
  const locker = useLocker(1);
  const theme = useTheme().get();
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;

  let component = <IntroStack />;
  if (locker.isLocked()) {
    component = <Unlock state={locker.get()}/>
  }
  else if (currentAddress.get()) {
    component = <Tabs />
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <PolyfillCrypto />

      {component}

      <StatusBar style="auto" />
      <Toast />
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();
const Tabs = () => {
  const theme = useTheme().get();
  const { Color, FontFamily, Border } = theme.vars;
  const styles = theme.styles;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        ...styles.wrapperFull,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        flex: 1,
      }}>

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
            title: i18n.t('Wallet'),
            header: () => (<View />),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="wallet" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen name="Swap"
          component={Unavailable}
          options={{
            title: i18n.t('Swap'),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="swap" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Dapps"
          component={Unavailable}
          options={{
            title: i18n.t('Dapps'),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="appstore-o" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="SettingStack"
          component={SettingStack}
          options={{
            title: i18n.t('Settings'),
            header: () => (<View />),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

