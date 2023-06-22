import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ResetPasswordNavigationProp, SettingNavigationProp } from '../types/navigation';
import { useTheme, useI18n, useBiometric } from '../hooks';
import { Wrapper, Text, Switch } from '../components';
import ListItem from '../components/ListItem';
import { setBiometric } from '../actions';
import { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import * as LocalAuthentication from "expo-local-authentication";

export default () => {
    const navigation = useNavigation<SettingNavigationProp>();
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

    return (
        <Wrapper type='full'>

            <ListItem
                title={i18n.t('change_password')}
                name={i18n.t('change_password')}
                description={i18n.t('change_password_desc')}
                onPress={() => navigation.push('ChangePassword')}
            />

            <View style={styles.separator} />

            <ListItem
                title={i18n.t('show_seed')}
                name={i18n.t('show_seed')}
                description={i18n.t('show_seed_desc')}
                onPress={() => navigation.push('ShowSeed')}
            />

            <View style={styles.separator} />

            <ListItem
                title={i18n.t('change_autolock')}
                name={i18n.t('change_autolock')}
                description={i18n.t('change_autolock_desc')}
                onPress={() => navigation.push('ChangeAutolock')}
            />

            {biometricSupport.get() === true && fingerprint.get() === true &&
                <View>
                    <View style={styles.separator} />

                    <View style={styles.listItemContainer}>
                        <View>
                            <Text style={styles.listItemTitle}>{i18n.t('biometric_unlock')}</Text>
                            <Text style={styles.textSmall}>{i18n.t('enable_biometric_unlock')}</Text>
                        </View>

                        <Switch
                            onValueChange={() => setBiometric(!biometric.get())}
                            value={biometric.get()}
                        />
                    </View>
                </View>
            }

        </Wrapper>
    );
}
