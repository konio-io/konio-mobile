import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { IntroParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import Intro from '../screens/Intro';
import SetPassword from '../screens/SetPassword';
import NewWallet from '../screens/NewWallet';
import NewWalletSeed from '../screens/NewWalletSeed';
import NewWalletSeedConfirm from '../screens/NewWalletSeedConfirm';
import ImportWalletSeed from '../screens/ImportWalletSeed';

const Stack = createStackNavigator<IntroParamList>();

export default () => {

  const i18n = useI18n();
  const theme = useTheme();
  const { FontFamily, Color } = theme.vars;

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: Color.base,
      },
      headerTitleStyle: {
        fontFamily: FontFamily.sans,
        color: Color.baseContrast
      },
      headerTintColor: Color.primary,
      headerShadowVisible: false,
      headerBackTitleVisible: false
    }}>
      <Stack.Screen
        name="Intro"
        component={Intro}
        options={{
          title: i18n.t('intro'),
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="SetPassword"
        component={SetPassword}
        options={{
          title: i18n.t('set_password'),
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="NewWallet"
        component={NewWallet}
        options={{
          title: i18n.t('new_wallet')
        }}
      />
      <Stack.Screen
        name="NewWalletSeed"
        component={NewWalletSeed}
        options={{
          title: i18n.t('new_wallet_seed')
        }}
      />
      <Stack.Screen
        name="NewWalletSeedConfirm"
        component={NewWalletSeedConfirm}
        options={{
          title: i18n.t('confirm_seed')
        }}
      />
      <Stack.Screen
        name="ImportWalletSeed"
        component={ImportWalletSeed}
        options={{
          title: i18n.t('import_wallet_seed')
        }}
      />
    </Stack.Navigator>
  );
}