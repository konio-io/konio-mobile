import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import type { UnlockStackParamList } from '../types/navigation'
import { useTheme } from '../hooks';
import i18n from '../locales';
import Unlock from './Unlock';
import ResetPassword from './ResetPassword';

const Stack = createStackNavigator<UnlockStackParamList>();

export default () => {

  const theme = useTheme().get();
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
        name="Unlock"
        component={Unlock}
        options={{
          header: () => (<View />)
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: i18n.t('reset_password')
        }}
      />
    </Stack.Navigator>
  );
}