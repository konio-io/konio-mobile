import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import '@ethersproject/shims'; //needs for etherjs compatibility
import './components/sheets';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import RootStack from './stacks/RootStack';
import { StatusBar } from 'expo-status-bar';
import { Toast } from "./components";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useTheme } from './hooks';
import { SheetProvider } from "react-native-actions-sheet";

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
          <RootStack />
        </SafeAreaView>
      </SheetProvider>

      <StatusBar style={theme.statusBarStyle} />
      <Toast />
    </NavigationContainer>
  );
}

