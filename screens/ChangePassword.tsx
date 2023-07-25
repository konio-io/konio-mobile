import { Wrapper, Screen, Button, TextInput } from "../components"
import { useI18n, useTheme } from "../hooks"
import React, { useEffect } from "react";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { UnlockNavigationProp } from "../types/navigation";
import { useHookstate } from "@hookstate/core";
import { lock, setPassword, showToast } from "../actions";
import { View } from "react-native";

export default () => {
    const navigation = useNavigation<UnlockNavigationProp>();
    const i18n = useI18n();
    const password = useHookstate('');
    const passwordConfirm = useHookstate('');
    const theme = useTheme();
    const styles = theme.styles;

    useEffect(() => {
        lock();
    }, []);

    const savePassword = () => {
        if ((!password.get())) {
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
        showToast({
            type: 'success',
            text1: i18n.t('password_set'),
        });
        navigation.goBack();
    }

    return (
        <Screen>
            <Wrapper>
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