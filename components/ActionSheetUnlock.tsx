import type { Theme } from "../types/ui";
import { Pressable, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n, useBiometric } from '../hooks';
import { Button, TextInput, Logo, Text } from '../components';
import { useNavigation } from '@react-navigation/native';
import { ResetPasswordNavigationProp } from '../types/navigation';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Toast from "react-native-toast-message";
import { useStore } from "../stores";

export default (props: SheetProps) => {
    const navigation = useNavigation<ResetPasswordNavigationProp>();
    const i18n = useI18n();
    const [password, setPwd] = useState('');
    const biometric = useBiometric();
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Secure, Lock } = useStore();

    const unlockPassword = () => {
        if (!Secure.getters.checkPassword(password)) {
            Toast.show({
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
            Toast.show({
                type: 'error',
                text1: i18n.t('wrong_biometric')
            });
        }
    };

    const unlockWallet = () => {
        Lock.actions.unlock();
        setPwd('');
        SheetManager.hide('unlock');
    }

    useEffect(() => {
        if (biometric) {
            unlockBiometric();
        }
    }, [biometric]);

    return (
        <ActionSheet id={props.sheetId} containerStyle={styles.container} closeOnTouchBackdrop={false}>
            <View style={{...styles.alignCenterColumn, paddingVertical: 30}}>
                <Logo />
            </View>

            <TextInput
                value={password}
                onChangeText={(v: string) => setPwd(v)}
                placeholder={i18n.t('password')}
                secureTextEntry={true}
            />
            <View style={styles.alignCenterColumn}>
                <Pressable onPress={() => navigation.navigate('ResetPassword')}>
                    <Text>{i18n.t('forgot_password')}</Text>
                </Pressable>
            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('unlock')}
                    icon={<Feather name="unlock" />}
                    onPress={unlockPassword}
                />
            </View>
        </ActionSheet>
    );
}

const createStyles = (theme: Theme) => {
    const { Color } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...styles,
        container: {
            backgroundColor: Color.base,
            ...styles.alignCenterRow,
            ...styles.paddingBase,
            ...styles.rowGapBase
        }
    });
}