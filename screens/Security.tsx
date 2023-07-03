import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SettingNavigationProp } from '../types/navigation';
import { useTheme, useI18n, useBiometric } from '../hooks';
import { Screen, Text, Switch, Separator } from '../components';
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
        <Screen>
            <ListItem
                title={i18n.t('change_password')}
                name={i18n.t('change_password')}
                description={i18n.t('change_password_desc')}
                onPress={() => navigation.navigate('ChangePassword')}
            />

            <Separator/>

            <ListItem
                title={i18n.t('show_seed')}
                name={i18n.t('show_seed')}
                description={i18n.t('show_seed_desc')}
                onPress={() => navigation.navigate('ShowSeed')}
            />

            <Separator/>

            <ListItem
                title={i18n.t('change_autolock')}
                name={i18n.t('change_autolock')}
                description={i18n.t('change_autolock_desc')}
                onPress={() => navigation.navigate('ChangeAutolock')}
            />

            {biometricSupport.get() === true && fingerprint.get() === true &&
                <View>
                    <Separator/>

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
        </Screen>
    );
}
