import 'react-native-gesture-handler';
import 'text-encoding-polyfill'; //needs for koilib compatibility
import '@ethersproject/shims'; //needs for etherjs compatibility
import './components/sheets.tsx';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './stacks/RootStack';

export default function App() {
  useFonts({
    'Poppins': require('./assets/Poppins-Regular.otf'),
  });

  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
}

