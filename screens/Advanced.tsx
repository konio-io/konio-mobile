import { View } from 'react-native';
import { useTheme, useI18n, useRcLimit } from '../hooks';
import { Screen, Text, Separator, TextInput } from '../components';

export default () => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const rcLimit = useRcLimit();

    return (
        <Screen>

            <View>
                <Separator />

                <View style={styles.listItemContainer}>
                    <View>
                        <Text style={styles.listItemTitle}>{i18n.t('rc_limit')}</Text>
                        <Text style={styles.textSmall}>{i18n.t('rc_limit_desc')}</Text>
                    </View>

                    <TextInput 
                        style={{...styles.textInput, width: 50, textAlign: 'center'}}
                        keyboardType='numeric'
                        value={rcLimit.get()} 
                        onChangeText={(v: string) => rcLimit.set(v)}
                    />
                </View>
            </View>

        </Screen>
    );
}
