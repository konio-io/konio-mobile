import { Logo, Text, Wrapper } from "../components"
import { useI18n, useTheme } from "../hooks"
import { View } from "react-native";
import { LogStore } from "../stores";

export default () => {
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    return (
        <Wrapper>
            <View style={styles.alignCenterColumn}>
                <Logo width={130} height={130}/>
            </View>

            <View style={styles.alignCenterColumn}>
                <Text style={{ ...styles.textError, ...styles.textCenter }}>
                    {i18n.t('migration_error')}
                </Text>
                <Text style={{ ...styles.text, ...styles.textCenter }}>
                    {i18n.t('migration_error_desc')}
                    {LogStore.state.get()}
                </Text>
            </View>
        </Wrapper>
    );
}
