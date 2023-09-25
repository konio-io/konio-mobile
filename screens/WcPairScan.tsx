import { Text, Link, WcLogo } from "../components"
import { useNavigation } from "@react-navigation/native";
import { WcPairScanNavigationProp } from "../types/navigation";
import { useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import CodeScanner from "../components/CodeScanner";
import { useStore } from "../stores";
import Toast from "react-native-toast-message";


export default () => {
    const navigation = useNavigation<WcPairScanNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const { WalletConnect, Log } = useStore();

    const _pair = (uri: string) => {
        WalletConnect.actions.pair(uri)
            .then(() => {
                navigation.navigate('WcSessions');
            })
            .catch(e => {
                Log.actions.logError(e);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('pairing_error'),
                    text2: i18n.t('check_logs')
                });
            });
    }

    return (
        <CodeScanner
            body={(
                <View style={{ ...styles.alignCenterColumn, ...styles.aligncenterRow, ...styles.paddingMedium, ...styles.rowGapBase }}>
                    <WcLogo />

                    <View style={{...styles.alignCenterColumn}}>
                        <Text>{i18n.t('scan_wc_code_or')}</Text>
                        <Link text={i18n.t('enter_code_manually')} onPress={() => navigation.navigate('WcPairInput')} />
                    </View>
                </View>
            )}
            onScan={(uri: string) => _pair(uri)}
            onClose={() => navigation.goBack()}
        />
    );
}