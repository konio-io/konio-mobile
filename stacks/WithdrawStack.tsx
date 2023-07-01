import { createStackNavigator } from '@react-navigation/stack';
import type { WithdrawStackParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import WithdrawTo from '../screens/WithdrawTo';
import WithdrawAmount from '../screens/WithdrawAmount';
import WithdrawConfirm from '../screens/WithdrawConfirm';
import WithdrawSelectCoin from '../screens/WithdrawSelectCoin';
import WithdrawSelectTo from '../screens/WithdrawSelectTo';
import WithdrawAddressbook from '../screens/WithdrawAddressbook';
import NewAddressbookItem from '../screens/NewAddressbookItem';

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
        name="WithdrawTo"
        component={WithdrawTo}
        options={{
          title: i18n.t('select_recipient'),
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="WithdrawAmount"
        component={WithdrawAmount}
        options={{
          title: i18n.t('select_amount'),
        }}
      />
      <Stack.Screen
        name="WithdrawConfirm"
        component={WithdrawConfirm}
        options={{
          title: i18n.t('confirm_withdraw')
        }}
      />
      <Stack.Screen
        name="WithdrawSelectCoin"
        component={WithdrawSelectCoin}
        options={{
          title: i18n.t('select_coin'),
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="WithdrawSelectTo"
        component={WithdrawSelectTo}
        options={{
          title: i18n.t('select_recipient_account'),
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="WithdrawAddressbook"
        component={WithdrawAddressbook}
        options={{
          title: i18n.t('addressbook'),
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="NewAddressbookItem"
        component={NewAddressbookItem}
        options={{
          title: i18n.t('new_addressbook_item'),
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
}