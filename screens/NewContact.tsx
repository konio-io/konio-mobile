import { useNavigation, useRoute } from '@react-navigation/native';
import { NewContactNavigationProp, NewContactRouteProp } from '../types/navigation';
import { addContact, refreshKap, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n, useKapAddress, useKapName } from '../hooks';
import { Alert, View } from 'react-native';
import { useTheme } from '../hooks';
import { utils } from 'koilib';
import { isASCIIString } from '../lib/utils';
import { useState } from 'react';

export default () => {
    const navigation = useNavigation<NewContactNavigationProp>();
    const route = useRoute<NewContactRouteProp>();
    const [address, setAddress] = useState(route.params.address ?? '');
    const [name, setName] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const [addressLoading, setaAddressLoading] = useState(false);
    const kapAddress = useKapName(address);
    const kapName = useKapAddress(address);

    const add = () => {
        const addr = address.includes('.') ? 
            kapAddress :
            address;

        if (!addr) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_address')
            });
            return;
        }

        if (!name) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_name')
            });
            return;
        }

        try {
            const check = utils.isChecksumAddress(addr);
            if (!check) {
                throw "Invalid address";
            }
        } catch (e) {
            showToast({
                type: 'error',
                text1: i18n.t('invalid_address')
            });
            return;
        }

        addContact({
            address: addr,
            name: name
        });

        navigation.navigate("WithdrawAsset", {
            to: addr
        })
    };

    const onAddressStopWriting = () => {
        if (address) {
            if (!isASCIIString(address)) {
                Alert.alert(i18n.t('warning'), i18n.t('homograph_attack_warning'), [
                    { text: i18n.t('ok'), onPress: loadKap },
                ]);
            } else {
                loadKap();
            }
        }
    };

    const loadKap = async () => {
        setaAddressLoading(true);
        try {
            await refreshKap(address);
        } catch (e) {
        }

        setaAddressLoading(false);
    };

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
                        onChangeText={(v: string) => setAddress(v.trim())}
                        placeholder={i18n.t('address')}
                        loading={addressLoading}
                        onStopWriting={onAddressStopWriting}
                        note={kapName || kapAddress}
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