import { createStackNavigator } from '@react-navigation/stack';
import type { OperationsStackParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import WithdrawStack from './WithdrawStack';
import Deposit from '../screens/Deposit';
import { View } from 'react-native';

const Stack = createStackNavigator<OperationsStackParamList>();

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
                name="WithdrawStack"
                component={WithdrawStack}
                options={{
                    title: i18n.t('send'),
                    header: () => (<View />)
                }}
            />
            <Stack.Screen
                name="Deposit"
                component={Deposit}
                options={{
                    title: i18n.t('send'),
                    header: () => (<View />)
                }}
            />
        </Stack.Navigator>
    );
}