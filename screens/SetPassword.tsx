import { Text, TextInput, ButtonPrimary, Wrapper } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { setPassword, showToast } from '../actions';
import { useTheme } from '../hooks';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const password = useHookstate('');
    const passwordConfirm = useHookstate('');

    const theme = useTheme().get();
    const { Color } = theme.vars;

    const savePassword = () => {
        if ((password.get() !== passwordConfirm.get())) {
            showToast({
                type: 'error',
                text1: 'The two passwords do not match',
            });
        } else {
            setPassword(password.get());
            if (password.get()) {
                showToast({
                    type: 'success',
                    text1: 'Password set.',
                });
            }
            navigation.push("NewWallet");
        }
    }

    return (
        <Wrapper>

            <Text>Choose a password if you want to protect the use of the app. Leave it blank if you don't want a password.</Text>

            <TextInput
                value={password.get()}
                onChangeText={(v: string) => password.set(v.trim())}
                placeholder='Password'
                secureTextEntry={true}
            />

            <TextInput
                value={passwordConfirm.get()}
                onChangeText={(v: string) => passwordConfirm.set(v.trim())}
                placeholder='Confirm password'
                secureTextEntry={true}
            />

            <ButtonPrimary
                title="Set password"
                icon={<Feather name="arrow-right" size={18} color={Color.primaryContrast} />}
                onPress={savePassword}
            />

        </Wrapper>
    )
}