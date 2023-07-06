import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { addContact, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text } from '../components';
import { useI18n } from '../hooks';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';
import { utils } from 'koilib';
import type { Theme } from '../types/store';

export default () => {
    const navigation = useNavigation<NewCoinNavigationProp>();
    const address = useHookstate('');
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const add = () => {
        if (!address.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_address')
            });
            return;
        }

        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_name')
            });
            return;
        }

        try {
            const check = utils.isChecksumAddress(address.get());
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
            address: address.get(),
            name: name.get()
        });

        navigation.goBack();
    };

    return (
        <Screen>
            <View style={{ ...styles.flex1, ...styles.paddingBase, ...styles.rowGapMedium }}>

                <View style={styles.rowGapSmall}>
                    <TextInput
                        autoFocus={true}
                        value={name.get()}
                        onChangeText={(v: string) => name.set(v.trim())}
                        placeholder={i18n.t('name')}
                    />
                    <Text style={styles.textSmall}>{i18n.t('ex_contact_name')}</Text>
                </View>
                <View style={styles.rowGapSmall}>
                    <TextInput
                        value={address.get()}
                        onChangeText={(v: string) => address.set(v.trim())}
                        placeholder={i18n.t('address')}
                    />
                    <Text style={styles.textSmall}>{i18n.t('ex_address')}</Text>
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