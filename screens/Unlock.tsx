import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { checkPassword, showToast, unlock } from '../actions';
import { useTheme } from '../hooks';
import { Button, TextInput, Logo, Wrapper, Text } from '../components';
import i18n from '../locales';
import ResetPassword from './ResetPassword';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { UnlockNavigationProp, UnlockRouteProp } from '../types/navigation';

export default () => {
    const route = useRoute<UnlockRouteProp>();
    const navigation = useNavigation<UnlockNavigationProp>();
    const password = useHookstate('');
    const showResetPassword = useHookstate(false);
    const key = route.params.key;

    const unlockWallet = () => {
        if (!checkPassword(password.get())) {
            showToast({
                type: 'error',
                text1: i18n.t('wrong_password')
            });
            //lock(key);
        } else {
            unlock(key);

            if (key === 'app') {
                const action = CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Main' },
                    ]
                });
                navigation.dispatch(action);
            } else {
                navigation.goBack();
            }
        }
    }

    const theme = useTheme().get();
    const { Spacing } = theme.vars;

    if (showResetPassword.get() === true) {
        return <ResetPassword/>;
    }

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