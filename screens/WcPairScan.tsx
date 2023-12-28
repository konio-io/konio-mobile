import { Text, Link, WcLogo } from "../components"
import { useNavigation } from "@react-navigation/native";
import { SettingsNavigationProp, WcPairScanNavigationProp } from "../types/navigation";
import { useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import CodeScanner from "../components/CodeScanner";
import { WalletConnectStore, LogStore } from "../stores";
import Toast from "react-native-toast-message";


export default () => {
    const navigation = useNavigation<WcPairScanNavigationProp>();
    const settingNavigation = useNavigation<SettingsNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const _pair = (uri: string) => {
        WalletConnectStore.actions.pair(uri)
            .then(() => {
                navigation.goBack();
            })
            .catch(e => {
                LogStore.actions.logError(e);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('pairing_error'),
                    text2: i18n.t('check_logs'),
                    onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
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