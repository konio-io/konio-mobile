import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, useI18n } from '../hooks';
import type { SettingsParamList } from '../types/navigation';
import SettingMenu from '../screens/SettingMenu';
import ChangeNetwork from '../screens/ChangeNetwork';
import ShowSeed from '../screens/ShowSeed';
import ChangeTheme from '../screens/ChangeTheme';
import ChangeLocale from '../screens/ChangeLocale';
import Security from '../screens/Security';
import ChangePassword from '../screens/ChangePassword';
import ChangeAutolock from '../screens/ChangeAutolock';
import Advanced from '../screens/Advanced';
import NewNetwork from '../screens/NewNetwork';
import Logs from '../screens/Logs';
import ShowPrivateKeys from '../screens/ShowPrivateKeys';

const Stack = createStackNavigator<SettingsParamList>();

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
        name="SettingMenu"
        component={SettingMenu}
        options={{
          title: i18n.t('settings'),
        }}
      />
      <Stack.Screen
        name="ChangeNetwork"
        component={ChangeNetwork}
        options={{
          title: i18n.t('networks'),
        }}
      />
      <Stack.Screen
        name="NewNetwork"
        component={NewNetwork}
        options={{
          title: i18n.t('add_network'),
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
        name="ShowPrivateKeys"
        component={ShowPrivateKeys}
        options={{
          title: i18n.t('show_private_keys'),
        }}
      />
      <Stack.Screen
        name="ChangeTheme"
        component={ChangeTheme}
        options={{
          title: i18n.t('theme'),
        }}
      />
      <Stack.Screen
        name="ChangeLocale"
        component={ChangeLocale}
        options={{
          title: i18n.t('locale'),
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          title: i18n.t('change_password'),
        }}
      />
      <Stack.Screen
        name="ChangeAutolock"
        component={ChangeAutolock}
        options={{
          title: i18n.t('change_autolock'),
        }}
      />
      <Stack.Screen
        name="Security"
        component={Security}
        options={{
          title: i18n.t('security'),
        }}
      />
      <Stack.Screen
        name="Advanced"
        component={Advanced}
        options={{
          title: i18n.t('advanced'),
        }}
      />
      <Stack.Screen
        name="Logs"
        component={Logs}
        options={{
          title: i18n.t('logs'),
        }}
      />
    </Stack.Navigator>
  );
}
