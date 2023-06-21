import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { WalletStackParamList } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';
import Wallet from './Wallet';
import AddCoin from './AddCoin';
import Coin from './Coin';
import Deposit from './Deposit';
import SwitchAccount from './SwitchAccount';
import WithdrawStack from './WithdrawStack';
import NewWalletAccount from './NewWalletAccount';

const Stack = createStackNavigator<WalletStackParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
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
          header: () => (<View />),
          title: i18n.t('wallet')
        }}
      />
      <Stack.Screen
        name="AddCoin"
        component={AddCoin}
        options={{
          title: i18n.t('add_coin')
        }}
      />
      <Stack.Screen
        name="Coin"
        component={Coin}
        options={({ route }) => {
          //ToDo check for another elegant way
          //const coin = stateCoins()[route.params.contractId];
          return {
            title: i18n.t('coin')
          }
        }}
      />
      <Stack.Screen
        name="Deposit"
        component={Deposit}
        options={{
          title: i18n.t('receive')
        }}
      />
      <Stack.Screen
        name="Withdraw"
        component={WithdrawStack}
        options={{
          header: () => (<View />),
          title: i18n.t('send')
        }}
      />
      <Stack.Screen
        name="SwitchAccount"
        component={SwitchAccount}
        options={{
          title: i18n.t('switch_account'),
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="NewWalletAccount"
        component={NewWalletAccount}
        options={{
          title: i18n.t('add_account')
        }}
      />
    </Stack.Navigator>
  );
}
