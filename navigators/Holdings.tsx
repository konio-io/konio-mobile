import { createStackNavigator } from '@react-navigation/stack';
import type { HoldingsParamList } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';
import NewCoin from '../screens/NewCoin';
import Coin from '../screens/Coin';
import Assets from '../screens/Assets';
import NewNft from '../screens/NewNft';
import Nft from '../screens/Nft';

const Stack = createStackNavigator<HoldingsParamList>();

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
        name="Assets"
        component={Assets}
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
      <Stack.Screen
        name="NewNft"
        component={NewNft}
        options={{
          title: i18n.t('add_nft')
        }}
      />
      <Stack.Screen
        name="Nft"
        component={Nft}
      />
    </Stack.Navigator>
  );
}