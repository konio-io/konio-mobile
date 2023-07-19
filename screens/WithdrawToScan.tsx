import { Screen, Text } from "../components"
import { useNavigation } from "@react-navigation/native";
import { WithdrawToNavigationProp } from "../types/navigation";
import { useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import CodeScanner from "../components/CodeScanner";

export default () => {
    const navigation = useNavigation<WithdrawToNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    return (
        <Screen>
            <View style={{ ...styles.alignCenterColumn, ...styles.aligncenterRow, ...styles.paddingBase }}>
                <Text>{i18n.t('scan_to_code')}</Text>
            </View>
            <CodeScanner onScan={(to: string) => navigation.navigate('WithdrawTo', { to })} />
        </Screen>
    );
}