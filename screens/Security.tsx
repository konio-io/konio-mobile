import { useNavigation } from '@react-navigation/native';
import { SecurityNavigationProp } from '../types/navigation';
import { useI18n, useBiometric } from '../hooks';
import { Screen, Switch } from '../components';
import ListItem from '../components/ListItem';
import { setBiometric } from '../actions';
import { useEffect, useState } from 'react';
import * as LocalAuthentication from "expo-local-authentication";
import { Feather, Ionicons } from '@expo/vector-icons';

export default () => {
    const navigation = useNavigation<SecurityNavigationProp>();
    const i18n = useI18n();
    const biometric = useBiometric();

    const [biometricSupport, setBiometricSupport] = useState(false);
    const [fingerprint, setFingerprint] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setBiometricSupport(compatible);
            const enroll = await LocalAuthentication.isEnrolledAsync();
            if (enroll) {
                setFingerprint(true);
            }
        })();
    }, []);

    return (
        <Screen>
            <ListItem
                content={i18n.t('change_password')}
                name={i18n.t('change_password')}
                description={i18n.t('change_password_desc')}
                onPress={() => navigation.navigate('ChangePassword')}
                icon={(<Feather name="key" />)}
            />

            <ListItem
                content={i18n.t('show_seed')}
                name={i18n.t('show_seed')}
                description={i18n.t('show_seed_desc')}
                onPress={() => navigation.navigate('ShowSeed')}
                icon={(<Feather name="eye" />)}
            />

            <ListItem
                content={i18n.t('show_private_keys')}
                name={i18n.t('show_private_keys')}
                description={i18n.t('show_private_keys_desc')}
                onPress={() => navigation.navigate('ShowPrivateKeys')}
                icon={(<Feather name="eye" />)}
            />

            <ListItem
                content={i18n.t('change_autolock')}
                name={i18n.t('change_autolock')}
                description={i18n.t('change_autolock_desc')}
                onPress={() => navigation.navigate('ChangeAutolock')}
                icon={(<Feather name="lock" />)}
            />

            {biometricSupport === true && fingerprint === true &&
                <ListItem
                    content={i18n.t('biometric_unlock')}
                    name={i18n.t('enable_biometric_unlock')}
                    description={i18n.t('biometric_unlock')}
                    onPress={() => navigation.navigate('ChangeAutolock')}
                    icon={(<Ionicons name="ios-finger-print-outline" />)}
                    right={(
                        <Switch
                            onValueChange={() => setBiometric(!biometric)}
                            value={biometric}
                        />
                    )}
                />
            }
            
        </Screen>
    );
}
