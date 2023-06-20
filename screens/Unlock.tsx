import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { checkPassword, showToast, lock, unlock } from '../actions';
import { useTheme } from '../hooks';
import { Button, TextInput, Logo, Wrapper, Text } from '../components';
import i18n from '../locales';
import { useNavigation } from '@react-navigation/native';
import { UnlockNavigationProp } from '../types/navigation';

export default () => {
    const navigation = useNavigation<UnlockNavigationProp>();
    const password = useHookstate('');
    const unlockWallet = () => {
        if (!checkPassword(password.get())) {
            showToast({
                type: 'error',
                text1: i18n.t('wrong_password')
            });
            lock();
        } else {
            unlock();
        }
    }

    const theme = useTheme().get();
    const { Spacing } = theme.vars;

    return (
        <Wrapper>

            <View style={{ marginBottom: Spacing.medium, alignItems: 'center' }}>
                <Logo />
            </View>

            <TextInput
                value={password.get()}
                onChangeText={(v: string) => password.set(v)}
                placeholder={i18n.t('password')}
                secureTextEntry={true}
            />

            <Button
                title={i18n.t('unlock')}
                icon={<Feather name="unlock" />}
                onPress={unlockWallet}
            />

            <View style={{ marginBottom: Spacing.medium, alignItems: 'center' }}>
            <Pressable onPress={() => navigation.navigate('ResetPassword')}>
                <Text>{i18n.t('forgot_password')}</Text>
            </Pressable>
        </View>

        </Wrapper >
    );
}