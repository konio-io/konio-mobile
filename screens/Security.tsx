import { useNavigation } from '@react-navigation/native';
import { SecurityNavigationProp } from '../types/navigation';
import { useI18n, useTheme } from '../hooks';
import { Screen, Switch, Text } from '../components';
import ListItem from '../components/ListItem';
import { useEffect, useState } from 'react';
import * as LocalAuthentication from "expo-local-authentication";
import { Feather, Ionicons } from '@expo/vector-icons';
import { SettingStore } from '../stores';
import { useHookstate } from '@hookstate/core';
import { View } from 'react-native';

export default () => {
    const navigation = useNavigation<SecurityNavigationProp>();
    const i18n = useI18n();
    const biometric = useHookstate(SettingStore.state.biometric).get();
    const [biometricSupport, setBiometricSupport] = useState(false);
    const [fingerprint, setFingerprint] = useState(false);
    const { styles } = useTheme();

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
                content={(
                    <View>
                        <Text>{i18n.t('change_password')}</Text>
                        <Text style={styles.textSmall}>{i18n.t('change_password_desc')}</Text>
                    </View>
                )}
                onPress={() => navigation.navigate('ChangePassword')}
                icon={(<Feather name="key" />)}
            />

            <ListItem
                content={(
                    <View>
                        <Text>{i18n.t('show_seed')}</Text>
                        <Text style={styles.textSmall}>{i18n.t('show_seed_desc')}</Text>
                    </View>
                )}
                onPress={() => navigation.navigate('ShowSeed')}
                icon={(<Feather name="eye" />)}
            />

            <ListItem
                content={(
                    <View>
                        <Text>{i18n.t('show_private_keys')}</Text>
                        <Text style={styles.textSmall}>{i18n.t('show_private_keys_desc')}</Text>
                    </View>
                )}
                onPress={() => navigation.navigate('ShowPrivateKeys')}
                icon={(<Feather name="eye" />)}
            />

            <ListItem
                content={(
                    <View>
                        <Text>{i18n.t('change_autolock')}</Text>
                        <Text style={styles.textSmall}>{i18n.t('change_autolock_desc')}</Text>
                    </View>
                )}
                onPress={() => navigation.navigate('ChangeAutolock')}
                icon={(<Feather name="lock" />)}
            />

            {biometricSupport === true && fingerprint === true &&
                <ListItem
                    content={(
                        <View>
                            <Text>{i18n.t('enable_biometric_unlock')}</Text>
                            <Text style={styles.textSmall}>{i18n.t('biometric_unlock')}</Text>
                        </View>
                    )}
                    onPress={() => navigation.navigate('ChangeAutolock')}
                    icon={(<Ionicons name="ios-finger-print-outline" />)}
                    right={(
                        <Switch
                            onValueChange={() => SettingStore.actions.setBiometric(!biometric)}
                            value={biometric}
                        />
                    )}
                />
            }

        </Screen>
    );
}
