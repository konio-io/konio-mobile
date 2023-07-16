import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import '@ethersproject/shims'; //needs for etherjs compatibility
import './components/sheets';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Toast } from "./components";
import { DarkTheme, DefaultTheme, NavigationContainer, getStateFromPath } from "@react-navigation/native";
import { useCurrentAddress, useTheme } from './hooks';
import { SheetProvider } from "react-native-actions-sheet";
import Drawer from './navigators/Drawer';
import { executeMigrations } from './actions';
import Loading from './screens/Loading';
import Intro from './navigators/Intro';
import { userStoreIsLoading, encryptedStoreIsLoading } from './stores';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export default function App() {
  useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
  });

  const theme = useTheme();
  const { Color } = theme.vars;
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Root: {
          initialRouteName: 'Account',
          screens: {
            Account: 'account',
            Settings: 'settings',
            WalletConnect: {
              screens: {
                WcPair: 'wc/:uri'
              }
            }
          }
        }
      }
    },
    getStateFromPath: (path: string, options: any) => {
      if (path.includes('wc?uri=')) {
        const newPath = path.replace('wc?uri=','wc/').replace('?','$');
        return getStateFromPath(newPath, options);
        /*
        return {
          index: 1,
          routes: [
            {
              name: "Root",
              state: {
                routes: [
                  {
                    name: "Account",
                  },
                  {
                    name: "WalletConnect",
                    state: {
                      routes: [
                        {
                          name: "Pair",
                          path: "wc",
                          params: {
                            uri: path.replace('wc?uri=','')
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }*/
      }

      return getStateFromPath(path, options);
    },
    /*getPathFromState(state, config) {
      // Return a path string here
      // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
    },*/
  };

  return (
    <NavigationContainer theme={navigationTheme} linking={linking} fallback={<Loading />}>
      <PolyfillCrypto />

      <SheetProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.base }}>
          <Main />
        </SafeAreaView>
      </SheetProvider>

      <StatusBar style={theme.statusBarStyle} />
      <Toast />
    </NavigationContainer>
  );
}

const Main = () => {
  const currentAddress = useCurrentAddress();

  if (userStoreIsLoading.get() || encryptedStoreIsLoading.get()) {
    return <Loading />;
  }

  executeMigrations();

  if (!currentAddress.get()) {
    return <Intro />;
  }

  return <Drawer />;
}
