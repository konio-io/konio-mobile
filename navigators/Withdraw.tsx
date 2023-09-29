import { createStackNavigator } from '@react-navigation/stack';
import type { WithdrawParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import NewContact from '../screens/NewContact';
import WithdrawAsset from '../screens/WithdrawAsset';
import WithdrawToScan from '../screens/WithdrawToScan';

const Stack = createStackNavigator<WithdrawParamList>();

export default () => {
  const i18n = useI18n();
  const theme = useTheme();
  const { FontFamily, Color } = theme.vars;

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: Color.base
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
        name="WithdrawAsset"
        component={WithdrawAsset}
        options={{
          title: i18n.t('send'),
        }}
        initialParams={{}}
      />
      <Stack.Screen
        name="NewContact"
        component={NewContact}
        options={{
          title: i18n.t('new_contact'),
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="WithdrawToScan"
        component={WithdrawToScan}
        options={{
          title: i18n.t('send'),
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}