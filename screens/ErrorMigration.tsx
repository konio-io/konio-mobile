import { Logo, Text, Wrapper } from "../components"
import { useI18n, useTheme } from "../hooks"
import { View } from "react-native";

export default () => {
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    return (
        <Wrapper>
            <View style={styles.alignCenterColumn}>
                <Logo/>
            </View>

            <View style={styles.alignCenterColumn}>
                <Text style={{ ...styles.textError, ...styles.textCenter }}>
                    {i18n.t('migration_error')}
                </Text>
                <Text style={{ ...styles.text, ...styles.textCenter }}>
                    {i18n.t('migration_error_desc')}
                </Text>
            </View>
        </Wrapper>
    );
}
