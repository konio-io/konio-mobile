import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, useI18n } from '../hooks';
import type { SettingStackParamList } from '../types/navigation';
import Setting from '../screens/Setting';
import ChangeNetwork from '../screens/ChangeNetwork';
import About from '../screens/About';
import ShowSeed from '../screens/ShowSeed';
import ChangeTheme from '../screens/ChangeTheme';
import ChangeLocale from '../screens/ChangeLocale';
import Security from '../screens/Security';
import ChangePassword from '../screens/ChangePassword';
import ChangeAutolock from '../screens/ChangeAutolock';

const Stack = createStackNavigator<SettingStackParamList>();

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
        name="Setting"
        component={Setting}
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
        name="ShowSeed"
        component={ShowSeed}
        options={{
          title: i18n.t('show_seed'),
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
        name="About"
        component={About}
        options={{
          title: i18n.t('about'),
        }}
      />
    </Stack.Navigator>
  );
}
