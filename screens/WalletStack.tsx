import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { WalletStackParamList } from '../types/navigation';
import { useTheme } from '../hooks';
import Wallet from './Wallet';
import AddCoin from './AddCoin';
import Coin from './Coin';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import SwitchWallet from './SwitchWallet';
import SelectCoin from './SelectCoin';
import SelectWallet from './SelectWallet';

const Stack = createStackNavigator<WalletStackParamList>();

export default () => {

  const theme = useTheme().get();
  const { FontFamily, Color, Border } = theme.vars;

  return (
    <Stack.Navigator
      screenOptions={{
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
        name="Wallet"
        component={Wallet}
        options={{
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="AddCoin"
        component={AddCoin}
        options={{
          title: 'Add coin'
        }}
      />
      <Stack.Screen
        name="Coin"
        component={Coin}
        options={({ route }) => {
          //ToDo check for another elegant way
          //const coin = stateCoins()[route.params.contractId];
          return {
            title: ''
          }
        }}
      />
      <Stack.Screen
        name="Deposit"
        component={Deposit}
        options={{
          title: 'Receive'
        }}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{
          title: 'Send'
        }}
      />
      <Stack.Screen
        name="SwitchWallet"
        component={SwitchWallet}
        options={{
          title: 'Switch Wallet',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="SelectCoin"
        component={SelectCoin}
        options={{
          title: 'Select Coin',
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="SelectWallet"
        component={SelectWallet}
        options={{
          title: 'Select Wallet',
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
}
