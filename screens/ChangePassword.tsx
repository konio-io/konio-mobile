import { Wrapper, Screen, Button, TextInput } from "../components"
import { useI18n, useTheme } from "../hooks"
import React, { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { UnlockNavigationProp } from "../types/navigation";
import { lock, setPassword, showToast } from "../actions";
import { View } from "react-native";

export default () => {
    const navigation = useNavigation<UnlockNavigationProp>();
    const i18n = useI18n();
    const [password, setPwd] = useState('');
    const [passwordConfirm, setPwdConfirm] = useState('');
    const theme = useTheme();
    const styles = theme.styles;

    useEffect(() => {
        lock();
    }, []);

    const savePassword = () => {
        if ((!password)) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_password'),
            });
            return;
        }

        if ((password !== passwordConfirm)) {
            showToast({
                type: 'error',
                text1: i18n.t('password_not_match'),
            });
            return;
        }

        setPassword(password);
        showToast({
            type: 'success',
            text1: i18n.t('password_set'),
        });
        navigation.goBack();
    }

    return (
        <Screen keyboardDismiss={true}>
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
        </Screen>
    );
}