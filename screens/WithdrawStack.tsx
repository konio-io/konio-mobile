import { createStackNavigator } from '@react-navigation/stack';
import type { WithdrawStackParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import SelectRecipient from './SelectRecipient';
import SelectAmount from './SelectAmount';
import ConfirmWithdraw from './ConfirmWithdraw';
import SelectCoin from './SelectCoin';
import SelectAccount from './SelectAccount';

const Stack = createStackNavigator<WithdrawStackParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
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
        name="SelectRecipient"
        component={SelectRecipient}
        options={{
          title: i18n.t('select_recipient'),
        }}
      />
      <Stack.Screen
        name="SelectAmount"
        component={SelectAmount}
        options={{
          title: i18n.t('select_amount'),
        }}
      />
      <Stack.Screen
        name="ConfirmWithdraw"
        component={ConfirmWithdraw}
        options={{
          title: i18n.t('confirm_withdraw')
        }}
      />
      <Stack.Screen
        name="SelectCoin"
        component={SelectCoin}
        options={{
          title: i18n.t('select_coin'),
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="SelectAccount"
        component={SelectAccount}
        options={{
          title: i18n.t('select_account'),
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
}