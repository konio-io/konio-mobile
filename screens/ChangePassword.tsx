import { Wrapper, Button, TextInput } from "../components"
import { useLocker, useI18n } from "../hooks"
import React, { useEffect } from "react";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { UnlockNavigationProp } from "../types/navigation";
import { useHookstate } from "@hookstate/core";
import { setPassword, showToast } from "../actions";

export default () => {
    const navigation = useNavigation<UnlockNavigationProp>();
    const key = 'change_password';
    const locker = useLocker(key);
    const i18n = useI18n();

    const password = useHookstate('');
    const passwordConfirm = useHookstate('');

    useEffect(() => {
        if (locker.get() === false) {
            setPassword(password.get());
            showToast({
                type: 'success',
                text1: i18n.t('password_set'),
            });
            locker.set(true);
            navigation.goBack();
        }
    }, [locker]);

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

        navigation.navigate('Unlock', { key });
    }

    return (
        <Wrapper>
            <TextInput
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

            <Button
                title={i18n.t('set_password')}
                icon={<Feather name="arrow-right" />}
                onPress={() => savePassword()}
            />
        </Wrapper>
    );
}