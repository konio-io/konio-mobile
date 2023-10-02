import { Text } from "../components"
import { useNavigation } from "@react-navigation/native";
import { HoldingsNavigationProp } from "../types/navigation";
import { useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import CodeScanner from "../components/CodeScanner";

export default () => {
    const navigation = useNavigation<HoldingsNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    return (
        <CodeScanner
            body={(
                <View style={{ ...styles.alignCenterColumn, ...styles.aligncenterRow, ...styles.paddingMedium }}>
                    <Text>{i18n.t('scan_to_code')}</Text>
                </View>
            )}
            onScan={(to: string) => {
                navigation.navigate('Withdraw', { to })
            }}
            onClose={() => navigation.goBack()}
        />
    );
}