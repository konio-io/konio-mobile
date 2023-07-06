import { View } from "react-native";
import { Text, Screen } from "../components";
import { useTheme, useI18n } from "../hooks";

export default () => {
    const {styles} = useTheme();
    const i18n = useI18n();

    return (
        <Screen>
            <View style={{...styles.flex1, ...styles.alignCenterColumn, ...styles.alignCenterRow}}>
                <Text>{i18n.t('available_soon')}</Text>
            </View>
        </Screen>
    );
};