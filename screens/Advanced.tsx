import { View, TextInput } from 'react-native';
import { useTheme, useI18n, useRcLimit } from '../hooks';
import { Screen, Text } from '../components';

export default () => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const rcLimit = useRcLimit();

    return (
        <Screen>
            <View style={styles.listItemContainer}>
                <View>
                    <Text style={styles.textMedium}>{i18n.t('rc_limit')}</Text>
                    <Text style={styles.textSmall}>{i18n.t('rc_limit_desc')}</Text>
                </View>

                <View style={styles.textInputContainer}>
                    <TextInput
                        style={{ ...styles.textInputText, textAlign: 'center', width: 50}}
                        keyboardType='numeric'
                        value={rcLimit.get()}
                        onChangeText={(v: string) => rcLimit.set(v)}
                    />
                </View>
            </View>
        </Screen>
    );
}
