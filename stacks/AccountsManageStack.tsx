import { createStackNavigator } from '@react-navigation/stack';
import type { AccountsManageStackParamList } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';
import SwitchAccount from '../screens/SwitchAccount';
import NewAccount from '../screens/NewAccount';
import EditAccount from '../screens/EditAccount';

const Stack = createStackNavigator<AccountsManageStackParamList>();

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
        name="SwitchAccount"
        component={SwitchAccount}
        options={{
          title: i18n.t('accounts'),
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="NewAccount"
        component={NewAccount}
        options={{
          title: i18n.t('add_account')
        }}
      />
      <Stack.Screen
        name="EditAccount"
        component={EditAccount}
        options={{
          title: i18n.t('edit_account')
        }}
      />
    </Stack.Navigator>
  );
}
