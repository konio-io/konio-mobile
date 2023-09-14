import { createStackNavigator } from '@react-navigation/stack';
import type { WithdrawParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import NewContact from '../screens/NewContact';
import WithdrawAsset from '../screens/WithdrawAsset';

const Stack = createStackNavigator<WithdrawParamList>();

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
    </Stack.Navigator>
  );
}