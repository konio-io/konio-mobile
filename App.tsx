import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import '@ethersproject/shims'; //needs for etherjs compatibility
//import './components/sheets';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Toast } from "./components";
import { DarkTheme, DefaultTheme, NavigationContainer, getStateFromPath } from "@react-navigation/native";
import { useTheme } from './hooks';
import { SheetProvider } from "react-native-actions-sheet";
import Loading from './screens/Loading';
import Intro from './navigators/Intro';
import { useStoreLoaded, useStore } from './stores';
import ErrorMigration from './screens/ErrorMigration';
import Spinner from './components/Spinner';
import { Text } from 'react-native';
import Drawer from './navigators/Drawer';

export default function App() {
  useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
    'Poppins_bold': require('./assets/Poppins_bold.otf')
  });

  const theme = useTheme();
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;

  const linking = {
    prefixes: ['wc://', 'konio://'],
    config: {
      screens: {
        Root: {
          initialRouteName: 'Account',
          screens: {
            Account: 'account',
            Settings: 'settings'
          }
        }
      }
    },
    getStateFromPath: (path: string, options: any) => {
      if (path.includes('@2') && !path.includes('requestId')) {
        //walletConnectSetUri(`wc:${path}`);
      }

      return getStateFromPath(path, options);
    },
  };

  return (
    <NavigationContainer theme={navigationTheme} linking={linking} fallback={<Loading />}>
      <PolyfillCrypto />

      <SheetProvider>
        <Main />
      </SheetProvider>

      <StatusBar style={theme.statusBarStyle} />
      <Toast />
      <Spinner />
    </NavigationContainer>
  );
}

const Main = () => {
  const storeLoaded = useStoreLoaded();
  const store = useStore();
  
  
  if (!storeLoaded) {
    return <Loading />;
  }

  if (store.Setting.state.currentAccountId.get() === '') {
    return <Intro/>
  }

  try {
    //executeMigrations();
  } catch (e) {
    return <ErrorMigration />;
  }

  return <Drawer/>
}