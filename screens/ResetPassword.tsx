import { Text, TextInput, Button, Wrapper, Screen } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { setPassword, showToast } from '../actions';
import { useCurrentSeed, useTheme, useI18n } from '../hooks';
import { View } from 'react-native';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const password = useHookstate('');
    const passwordConfirm = useHookstate('');
    const seed = useHookstate('');
    const currentSeed = useCurrentSeed();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const savePassword = () => {
        if (currentSeed.get() !== seed.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('seed_not_match'),
            });
            return;
        }

        if ((!password.get())) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_password'),
            });
            return;
        }

        if ((password.get() !== passwordConfirm.get())) {
            showToast({
                type: 'error',
                text1: i18n.t('password_not_match'),
            });
            return;
        }

        setPassword(password.get());
        showToast({
            type: 'success',
            text1: i18n.t('password_set'),
        });
        navigation.goBack();
    }

    return (
        <Screen>
            <Wrapper>

                <Text>{i18n.t('write_current_seed')}</Text>

                <TextInput
                    autoFocus={true}
                    style={{ ...styles.textInputMultiline }}
                    multiline={true}
                    numberOfLines={4}
                    value={seed.get()}
                    placeholder={i18n.t('seed_phrase')}
                    onChangeText={(text: string) => seed.set(text.toLowerCase())}
                />

                <TextInput
                    value={password.get()}
                    onChangeText={(v: string) => password.set(v.trim())}
                    placeholder={i18n.t('password')}
                    secureTextEntry={true}
                />

                <TextInput
                    value={passwordConfirm.get()}
                    onChangeText={(v: string) => passwordConfirm.set(v.trim())}
                    placeholder={i18n.t('confirm_password')}
                    secureTextEntry={true}
                />
            </Wrapper>

            <View style={styles.screenFooter}>
                <Button
                    title={i18n.t('set_password')}
                    icon={<Feather name="arrow-right" />}
                    onPress={savePassword}
                />
            </View>
        </Screen>
    )
}