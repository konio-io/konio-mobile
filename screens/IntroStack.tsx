import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { IntroStackParamList } from '../types/navigation'
import { useTheme } from '../hooks';
import Intro from './Intro';
import SetPassword from './SetPassword';
import NewWallet from './NewWallet';
import NewWalletSeed from './NewWalletSeed';
import NewWalletSeedConfirm from './NewWalletSeedConfirm';
import ImportWalletSeed from './ImportWalletSeed';

const Stack = createStackNavigator<IntroStackParamList>();

export default () => {

  const theme = useTheme().get();
  const { FontFamily, Color, Border } = theme.vars;

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
        name="Intro"
        component={Intro}
        options={{
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="SetPassword"
        component={SetPassword}
        options={{
          title: 'Set Password',
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="NewWallet"
        component={NewWallet}
        options={{
          title: "New wallet"
        }}
      />
      <Stack.Screen
        name="NewWalletSeed"
        component={NewWalletSeed}
        options={{
          title: "New wallet seed"
        }}
      />
      <Stack.Screen
        name="NewWalletSeedConfirm"
        component={NewWalletSeedConfirm}
        options={{
          title: "Confirm seed"
        }}
      />
      <Stack.Screen
        name="ImportWalletSeed"
        component={ImportWalletSeed}
        options={{
          title: "Import wallet seed"
        }}
      />
    </Stack.Navigator>
  );
}