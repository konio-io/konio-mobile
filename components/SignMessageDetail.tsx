import { Text } from "../components"
import { useI18n, useTheme } from "../hooks";
import { View } from "react-native";

export default (props: {
    message: string
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    return (
        <View>
            <Text style={styles.textSmall}>{i18n.t('message')}</Text>
            <Text>{props.message}</Text>
        </View>
    )
}