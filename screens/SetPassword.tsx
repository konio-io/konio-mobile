import { Text, TextInput, Button, Wrapper } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { setPassword, showToast } from '../actions';
import i18n from '../locales';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const password = useHookstate('');
    const passwordConfirm = useHookstate('');

    const savePassword = () => {
        if (!password.get()) {
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
        if (password.get()) {
            showToast({
                type: 'success',
                text1: i18n.t('password_set'),
            });
        }
        navigation.push("NewWallet");
    }

    return (
        <Wrapper>

            <Text>{i18n.t('choose_password_desc')}</Text>

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

            <Button
                title={i18n.t('set_password')}
                icon={<Feather name="arrow-right"/>}
                onPress={savePassword}
            />

        </Wrapper>
    )
}