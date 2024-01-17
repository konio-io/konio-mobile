import { View, TextInput } from 'react-native';
import { useTheme, useI18n } from '../hooks';
import { Screen, Text } from '../components';
import { SettingStore } from '../stores';
import { useEffect, useState } from 'react';

export default () => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const [value, setValue] = useState('')

    useEffect(() => {
        setValue(SettingStore.state.maxMana.get().toString());
    }, []);

    useEffect(() => {
        SettingStore.actions.setMaxMana(parseInt(value));
    }, [value]);

    return (
        <Screen keyboardDismiss={true}>
            <View style={styles.listItemContainer}>
                <View>
                    <Text style={styles.textMedium}>{i18n.t('max_mana')}</Text>
                    <Text style={styles.textSmall}>{i18n.t('max_mana_desc')}</Text>
                </View>

                <View style={styles.textInputContainer}>
                    <TextInput
                        style={{ ...styles.textInputText, textAlign: 'center', width: 50}}
                        keyboardType='numeric'
                        value={value}
                        onChangeText={(v: string) => {
                            const value = parseInt(v);
                            if (value > 100) {
                                setValue("100")
                            } else if (value < 1) {
                                setValue("1")
                            } else {
                                setValue(v);
                            }
                        }}
                    />
                </View>
            </View>
        </Screen>
    );
}
