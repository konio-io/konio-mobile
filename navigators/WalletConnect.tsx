import { createStackNavigator } from '@react-navigation/stack';
import { WalletConnectParamList } from '../types/navigation'
import { useTheme, useI18n } from '../hooks';
import WcSessions from '../screens/WcSessions';
import WcPairScan from '../screens/WcPairScan';
import WcPairInput from '../screens/WcPairInput';

const Stack = createStackNavigator<WalletConnectParamList>();

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
                name="WcPairScan"
                component={WcPairScan}
                options={{
                    title: i18n.t('new_connection'),
                    presentation: 'modal',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="WcPairInput"
                component={WcPairInput}
                options={{
                    title: i18n.t('new_connection'),
                    presentation: 'modal'
                }}
            />
            <Stack.Screen
                name="WcSessions"
                component={WcSessions}
                options={{
                    title: i18n.t('wc_sessions'),
                }}
            />
        </Stack.Navigator>
    );
}

