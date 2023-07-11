import { createStackNavigator } from '@react-navigation/stack';
import { WalletConnectParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import DappPair from '../screens/DappPair';
import DappSessions from '../screens/DappSessions';
import DappSign from '../screens/DappSign';
import DappHome from '../screens/DappHome';

const Stack = createStackNavigator<WalletConnectParamList>();

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
                name="DappHome"
                component={DappHome}
                options={{
                    title: i18n.t('dapp_home'),
                }}
            />
            <Stack.Screen
                name="DappSessions"
                component={DappSessions}
                options={{
                    title: i18n.t('sessions'),
                }}
            />
            <Stack.Screen
                name="DappPair"
                component={DappPair}
                options={{
                    title: i18n.t('pairing'),
                    presentation: 'modal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="DappSign"
                component={DappSign}
                options={{
                    title: i18n.t('signing'),
                    presentation: 'modal',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

