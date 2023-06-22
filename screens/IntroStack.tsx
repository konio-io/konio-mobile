import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { IntroStackParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import Intro from './Intro';
import SetPassword from './SetPassword';
import NewWallet from './NewWallet';
import NewWalletSeed from './NewWalletSeed';
import NewWalletSeedConfirm from './NewWalletSeedConfirm';
import ImportWalletSeed from './ImportWalletSeed';

const Stack = createStackNavigator<IntroStackParamList>();

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