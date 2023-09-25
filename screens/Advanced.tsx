import { View, TextInput } from 'react-native';
import { useTheme, useI18n } from '../hooks';
import { Screen, Text } from '../components';
import { useStore } from '../stores';

export default () => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const { Setting } = useStore();

    return (
        <Screen keyboardDismiss={true}>
            <View style={styles.listItemContainer}>
                <View>
                    <Text style={styles.textMedium}>{i18n.t('rc_limit')}</Text>
                    <Text style={styles.textSmall}>{i18n.t('rc_limit_desc')}</Text>
                </View>

                <View style={styles.textInputContainer}>
                    <TextInput
                        style={{ ...styles.textInputText, textAlign: 'center', width: 50}}
                        keyboardType='numeric'
                        value={Setting.state.rcLimit.get()}
                        onChangeText={(v: string) => Setting.actions.setRcLimit(v)}
                    />
                </View>
            </View>
        </Screen>
    );
}
