import { createStackNavigator } from '@react-navigation/stack';
import type { AssetsParamList } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';
import AssetsCoins from '../screens/AssetsCoins';
import NewCoin from '../screens/NewCoin';
import Coin from '../screens/Coin';

const Stack = createStackNavigator<AssetsParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { FontFamily, Color } = theme.vars;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.base,
        },
        headerTitleStyle: {
          fontFamily: FontFamily.sans,
          color: Color.baseContrast
        },
        headerTintColor: Color.primary
      }}>
      <Stack.Screen
        name="AssetsCoins"
        component={AssetsCoins}
      />
      <Stack.Screen
        name="NewCoin"
        component={NewCoin}
        options={{
          title: i18n.t('add_coin')
        }}
      />
      <Stack.Screen
        name="Coin"
        component={Coin}
      />
    </Stack.Navigator>
  );
}