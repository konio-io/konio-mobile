import { useHookstate } from '@hookstate/core';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NewCoinNavigationProp, NewContactRouteProp } from '../types/navigation';
import { addContact, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n } from '../hooks';
import { View } from 'react-native';
import { useTheme } from '../hooks';
import { utils } from 'koilib';

export default () => {
    const navigation = useNavigation<NewCoinNavigationProp>();
    const route = useRoute<NewContactRouteProp>();
    const address = useHookstate(route.params.address ?? '');
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
                </View>
                <View style={styles.rowGapSmall}>
                    <TextInput
                        value={address.get()}
                        onChangeText={(v: string) => address.set(v.trim())}
                        placeholder={i18n.t('address')}
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