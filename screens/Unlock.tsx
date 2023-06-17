import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { State, useHookstate } from '@hookstate/core';
import { checkPassword, showToast } from '../actions';
import { useTheme } from '../hooks';
import { ButtonPrimary, TextInput, Logo, Wrapper } from '../components';
import i18n from '../locales';

export default (props: {
    unlockState: State<boolean>
}) => {
    const password = useHookstate('');
    const unlock = () => {
        if (!checkPassword(password.get())) {
            showToast({
                type: 'error',
                text1: i18n.t('wrong_password')
            });
            props.unlockState.set(false);
        } else {
            props.unlockState.set(true);
        }
    }

    const theme = useTheme().get();
    const { Color, Spacing } = theme.vars;

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

            <ButtonPrimary
                title={i18n.t('unlock')}
                icon={<Feather name="unlock" size={18} color={Color.primaryContrast} />}
                onPress={unlock} />

        </Wrapper>
    )
}