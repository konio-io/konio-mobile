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
import { useCurrentAddress, useTheme, useI18n, useLocker } from './hooks';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPassword from './screens/ResetPassword';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
  });

  const loaded = fontsLoaded;

  return (
    <SafeAreaProvider>
      {loaded ? <LoadedApp /> : <Loading />}
    </SafeAreaProvider>
  );
}

const RootStack = createStackNavigator();

const LoadedApp = () => {

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
        <RootStack.Navigator>
          <RootStack.Screen
            name="Main"
            component={Tabs}
            options={{
              header: () => (<View />)
            }}
          />
          <RootStack.Screen
            name="Unlock"
            component={Unlock}
            options={{
              presentation: 'modal',
              header: () => (<View />)
            }}
          />
          <RootStack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{
              title: i18n.t('reset_password')
            }}
          />
        </RootStack.Navigator>
      }

      <StatusBar style={theme.statusBarStyle} />
      <Toast />
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();
const Tabs = () => {
  const theme = useTheme();
  const { Color, FontFamily, Border } = theme.vars;
  const styles = theme.styles;
  const insets = useSafeAreaInsets();
  const i18n = useI18n();
  
  useLocker({key: 'app', initialValue: true});

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
            title: i18n.t('swap'),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="swap" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Dapps"
          component={Unavailable}
          options={{
            title: i18n.t('dapps'),
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

