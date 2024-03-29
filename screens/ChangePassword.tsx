import { Wrapper, Screen, Button, TextInput } from "../components"
import { useI18n, useLockState, useTheme } from "../hooks"
import React, { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { ChangePasswordNavigationProp } from "../types/navigation";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { LockStore, SecureStore } from "../stores";
import { AntDesign } from '@expo/vector-icons';

export default () => {
    const navigation = useNavigation<ChangePasswordNavigationProp>();
    const i18n = useI18n();
    const [password, setPwd] = useState('');
    const [passwordConfirm, setPwdConfirm] = useState('');
    const theme = useTheme();
    const styles = theme.styles;
    const lockState = useLockState();

    useEffect(() => {
        LockStore.actions.lock();
    }, []);

    const savePassword = () => {
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

        SecureStore.actions.setPassword(password);
        Toast.show({
            type: 'success',
            text1: i18n.t('password_set'),
        });
        navigation.goBack();
    }

    return (
        <Screen keyboardDismiss={true}>
            {

                lockState.get() === false &&
                <>
                    <Wrapper>
                        <TextInput
                            autoFocus={true}
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
                            onPress={() => savePassword()}
                        />
                    </View>
                </>
            }
            {
                lockState.get() === true &&
                <View style={{ ...styles.alignCenterColumn, ...styles.alignCenterRow, flex: 1 }}>
                    <AntDesign name="lock1" size={150} color={theme.vars.Border.color} />
                </View>
            }
        </Screen>
    );
}