import { Text, TextInput, Button, Wrapper, Screen, Switch } from '../components';
import { useNavigation } from '@react-navigation/native';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { setBiometric, setPassword, showToast } from '../actions';
import { useBiometric, useI18n, useTheme } from '../hooks';
import { View } from 'react-native';
import { useEffect } from 'react';
import * as LocalAuthentication from "expo-local-authentication";

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const password = useHookstate('');
    const passwordConfirm = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const biometric = useBiometric();

    const biometricSupport = useHookstate(false);
    const fingerprint = useHookstate(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            biometricSupport.set(compatible);
            const enroll = await LocalAuthentication.isEnrolledAsync();
            if (enroll) {
                fingerprint.set(true);
            }
        })();
    }, []);

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
        navigation.navigate("NewWallet");
    }

    return (
        <Screen keyboardDismiss={true}>

            <Wrapper>
                <Text>{i18n.t('choose_password_desc')}</Text>

                <TextInput
                    autoFocus={true}
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

                {biometricSupport.get() === true && fingerprint.get() === true &&
                    <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                        <View style={{ flexGrow: 1 }}>
                            <Text>{i18n.t('biometric_unlock')}</Text>
                            <Text style={styles.textSmall}>{i18n.t('enable_biometric_unlock')}</Text>
                        </View>


                        <Switch
                            onValueChange={() => setBiometric(!biometric.get())}
                            value={biometric.get()}
                        />

                    </View>
                }
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