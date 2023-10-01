import { useNavigation, useRoute } from '@react-navigation/native';
import { NewContactNavigationProp, NewContactRouteProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n } from '../hooks';
import { Alert, View } from 'react-native';
import { useTheme } from '../hooks';
import { utils } from 'koilib';
import { isASCIIString } from '../lib/utils';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { ContactStore, NameserverStore } from '../stores';

export default () => {
    const navigation = useNavigation<NewContactNavigationProp>();
    const route = useRoute<NewContactRouteProp>();
    const [address, setAddress] = useState(route.params.address ?? '');
    const [name, setName] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const [loading, setLoading] = useState(false);

    const add = () => {
        if (!address) {
            Toast.show({
                type: 'error',
                text1: i18n.t('missing_address')
            });
            return;
        }

        if (!name) {
            Toast.show({
                type: 'error',
                text1: i18n.t('missing_name')
            });
            return;
        }

        try {
            const check = utils.isChecksumAddress(address);
            if (!check) {
                throw "Invalid address";
            }
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: i18n.t('invalid_address')
            });
            return;
        }

        ContactStore.actions.addContact({
            address,
            name: name
        });

        navigation.navigate("Withdraw", {
            to: address
        })
    };

    const _onChange = (v: string) => {
        /*if (v && !!isASCIIString(address)) {
            Alert.alert(i18n.t('warning'), i18n.t('homograph_attack_warning'), [
                { text: i18n.t('ok'), onPress: loadKap },
            ]);
        }*/

        setAddress(v);

        const nsName = NameserverStore.getters.validateKapQuery(v) || NameserverStore.getters.validateNicQuery(v);
        if (nsName) {
            setLoading(true);
            NameserverStore.getters.getAddress(v)
                .then(addr => {
                    setLoading(false);
                    if (addr) {
                        setAddress(addr);
                        setName(nsName);
                        NameserverStore.actions.add(addr, v);
                    }
                })
                .catch(e => {
                    setLoading(false);
                });
        }
    }

    return (
        <Screen keyboardDismiss={true}>
            <View style={{ ...styles.flex1, ...styles.paddingBase, ...styles.rowGapMedium }}>

                <View style={styles.rowGapSmall}>
                    <TextInput
                        autoFocus={true}
                        value={name}
                        onChangeText={(v: string) => setName(v.trim())}
                        placeholder={i18n.t('name')}
                    />
                </View>
                <View style={styles.rowGapSmall}>
                    <TextInput
                        value={address}
                        onChangeText={(v: string) => _onChange(v.trim())}
                        placeholder={i18n.t('address')}
                        loading={loading}
                        multiline={true}
                    />
                </View>

            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('add_contact')}
                    onPress={() => add()}
                    icon={<Feather name="plus" />}
                />
            </View>
        </Screen>
    );
}