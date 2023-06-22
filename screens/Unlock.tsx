import { Pressable, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { checkPassword, showToast, unlock } from '../actions';
import { useTheme, useI18n, useBiometric } from '../hooks';
import { Button, TextInput, Logo, Wrapper, Text } from '../components';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { UnlockNavigationProp, UnlockRouteProp } from '../types/navigation';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect } from 'react';

export default () => {
    const route = useRoute<UnlockRouteProp>();
    const navigation = useNavigation<UnlockNavigationProp>();
    const i18n = useI18n();
    const password = useHookstate('');
    const key = route.params.key;
    const biometric = useBiometric();
    const theme = useTheme();
    const { Spacing } = theme.vars;

    const unlockPassword = () => {
        if (!checkPassword(password.get())) {
            showToast({
                type: 'error',
                text1: i18n.t('wrong_password')
            });
            return;
        }

        unlockWallet();
    };

    const unlockBiometric = async () => {
        try {
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: i18n.t('biometric_unlock'),
                disableDeviceFallback: true,
                cancelLabel: i18n.t('cancel'),
            });
            if (biometricAuth.success) {
                unlockWallet();
            }
        } catch (error) {
            showToast({
                type: 'error',
                text1: i18n.t('wrong_biometric')
            });
        }
    };

    const unlockWallet = () => {
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

    useEffect(() => {
        if (biometric.get()) {
            unlockBiometric();
        }
    },[biometric]);

    /**
     * prevent go back if action type is "GO_BACK" and key of locker is "app"
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === 'GO_BACK' && key === 'app') {
                e.preventDefault();
            }
        });
    },[navigation]);
    */

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
                onPress={unlockPassword}
            />

            <View style={{ marginBottom: Spacing.medium, alignItems: 'center' }}>
                <Pressable onPress={() => navigation.navigate('ResetPassword')}>
                    <Text>{i18n.t('forgot_password')}</Text>
                </Pressable>
            </View>

        </Wrapper >
    );
}