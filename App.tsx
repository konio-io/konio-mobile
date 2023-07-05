import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import '@ethersproject/shims'; //needs for etherjs compatibility
import './components/sheets';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Toast } from "./components";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useCurrentAddress, useTheme } from './hooks';
import { SheetProvider } from "react-native-actions-sheet";
import Drawer from './navigators/Drawer';
import { executeMigrations } from './actions';
import Loading from './screens/Loading';
import Intro from './navigators/Intro';
import { userStoreIsLoading, encryptedStoreIsLoading, UserStore } from './stores';

export default function App() {
  useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
  });

  const theme = useTheme();
  const { Color } = theme.vars;
  const PolyfillCrypto = global.PolyfillCrypto;
  const navigationTheme = theme.name === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <PolyfillCrypto />

      <SheetProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.base }}>
          <Main/>
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

  return <Drawer/>;
}
