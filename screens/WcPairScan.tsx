import { Screen, Text, Link } from "../components"
import { useNavigation } from "@react-navigation/native";
import { WcPairNavigationProp } from "../types/navigation";
import { useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import CodeScanner from "../components/CodeScanner";

export default () => {
    const navigation = useNavigation<WcPairNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    return (
        <Screen>
            <View style={{ ...styles.alignCenterColumn, ...styles.aligncenterRow, ...styles.paddingBase }}>
                <Text>{i18n.t('scan_wc_code_or')}</Text>
                <Link text={i18n.t('enter_code_manually')} onPress={() => navigation.navigate('WcPairInput')}/>
            </View>
            <CodeScanner onScan={(uri: string) => navigation.navigate('WcPair', { uri })} />
        </Screen>
    );
}

