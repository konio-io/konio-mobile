import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks';
import type { SettingStackParamList } from '../types/navigation';
import Setting from './Setting';
import Network from './Network';
import About from './About';
import NewWalletAccount from './NewWalletAccount';
import ResetPassword from './ResetPassword';
import i18n from '../locales';
import ShowSeed from './ShowSeed';

const Stack = createStackNavigator<SettingStackParamList>();

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
        name="Setting"
        component={Setting}
        options={{
          title: i18n.t('settings'),
        }}
      />
      <Stack.Screen
        name="NewWalletAccount"
        component={NewWalletAccount}
        options={{
          title: i18n.t('add_account')
        }}
      />
      <Stack.Screen
        name="Network"
        component={Network}
        options={{
          title: i18n.t('networks'),
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: i18n.t('reset_password'),
        }}
      />
      <Stack.Screen
        name="ShowSeed"
        component={ShowSeed}
        options={{
          title: i18n.t('show_seed'),
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          title: i18n.t('about'),
        }}
      />
    </Stack.Navigator>
  );
}
