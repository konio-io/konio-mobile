import { Text, TextInput, Button, Wrapper, Screen } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import Toast from 'react-native-toast-message';
import { useStore } from '../stores';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const [password, setPwd] = useState('');
    const [passwordConfirm, setPwdConfirm] = useState('');
    const [seed, setSeed] = useState('');
    const { Secure } = useStore();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    useEffect(() => {
        SheetManager.hide('unlock');
        return () => {
            SheetManager.show('unlock');
        };
    }, []);

    const savePassword = () => {
        if (Secure.getters.getSeed() !== seed) {
            Toast.show({
                type: 'error',
                text1: i18n.t('seed_not_match'),
            });
            return;
        }

        if ((!password)) {
            Toast.show({
                type: 'error',
                text1: i18n.t('missing_password'),
            });
            return;
        }

        if ((password !== passwordConfirm)) {
            Toast.show({
                type: 'error',
                text1: i18n.t('password_not_match'),
            });
            return;
        }

        Secure.actions.setPassword(password);
        Toast.show({
            type: 'success',
            text1: i18n.t('password_set'),
        });
        navigation.goBack();
    }

    return (
        <Screen keyboardDismiss={true}>
            <Wrapper>

                <Text>{i18n.t('write_current_seed')}</Text>

                <TextInput
                    autoFocus={true}
                    multiline={true}
                    numberOfLines={4}
                    value={seed}
                    placeholder={i18n.t('seed_phrase')}
                    onChangeText={(text: string) => setSeed(text.toLowerCase())}
                />

                <TextInput
                    value={password}
                    onChangeText={(v: string) => setPwd(v.trim())}
                    placeholder={i18n.t('password')}
                    secureTextEntry={true}
                />

                <TextInput
                    value={passwordConfirm}
                    onChangeText={(v: string) => setPwdConfirm(v.trim())}
                    placeholder={i18n.t('confirm_password')}
                    secureTextEntry={true}
                />
            </Wrapper>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('set_password')}
                    icon={<Feather name="arrow-right" />}
                    onPress={savePassword}
                />
            </View>
        </Screen>
    )
}