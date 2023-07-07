import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { checkPassword, showToast, unlock } from '../actions';
import { useTheme, useI18n, useBiometric } from '../hooks';
import { Button, TextInput, Logo, Screen, Text, Wrapper } from '../components';
import { useNavigation, useRoute } from '@react-navigation/native';
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
    const { styles } = useTheme();
    const preventBack = useHookstate(true);

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
        preventBack.set(false);
        password.set('');
        navigation.goBack();
    }

    useEffect(() => {
        if (biometric.get()) {
            unlockBiometric();
        }
    }, [biometric]);


    /**
     * prevent go back if action type is "GO_BACK"
     */
    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (preventBack.get() === true) {
                if (e.data.action.type === 'GO_BACK') {
                    e.preventDefault();
                }
            }
        });
    }, [navigation]);

    return (
        <Screen>
            <Wrapper>
                <View style={styles.alignCenterColumn}>
                    <Logo />
                </View>

                <TextInput
                    autoFocus={true}
                    value={password.get()}
                    onChangeText={(v: string) => password.set(v)}
                    placeholder={i18n.t('password')}
                    secureTextEntry={true}
                />
                <View style={styles.alignCenterColumn}>
                    <Pressable onPress={() => navigation.navigate('ResetPassword')}>
                        <Text>{i18n.t('forgot_password')}</Text>
                    </Pressable>
                </View>
            </Wrapper>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('unlock')}
                    icon={<Feather name="unlock" />}
                    onPress={unlockPassword}
                />
            </View>
        </Screen>
    );
}