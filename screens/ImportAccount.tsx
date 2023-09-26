import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Screen, TextInputActionPaste } from '../components';
import { useI18n, useTheme } from '../hooks';
import { Keyboard, View } from 'react-native';
import { MAX_ACCOUNT } from '../lib/Constants';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { AccountStore, SpinnerStore, LogStore, SettingStore } from '../stores';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const [name, setName] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const accounts = AccountStore.state;

    const _import = async () => {
        Keyboard.dismiss();

        if (Object.keys(accounts).length >= MAX_ACCOUNT) {
            Toast.show({
                type: 'error',
                text1: i18n.t('max_accounts_reached', {max: MAX_ACCOUNT})
            });
            return;
        }

        if (!name) {
            Toast.show({
                type: 'error',
                text1: i18n.t('missing_account_name')
            });
            return;
        }

        SpinnerStore.actions.showSpinner();

        AccountStore.actions.importAccount({
            name: name.trim(),
            privateKey: privateKey.trim()
        })
            .then(address => {
                SpinnerStore.actions.hideSpinner();
                SettingStore.actions.setCurrentAccount(address);
                navigation.goBack();
            })
            .catch(e => {
                SpinnerStore.actions.hideSpinner();
                LogStore.actions.logError(e);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('unable_to_add_account'),
                    text2: i18n.t('check_logs')
                });
            });
    };

    return (
        <Screen keyboardDismiss={true}>
            <View style={{...styles.flex1, ...styles.paddingBase, ...styles.rowGapSmall}}>
                <TextInput
                    autoFocus={true}
                    value={name}
                    placeholder={i18n.t('account_name')}
                    onChangeText={(text: string) => setName(text)}
                />
                 <TextInput
                    multiline={true}
                    value={privateKey}
                    numberOfLines={4}
                    placeholder={i18n.t('private_key')}
                    onChangeText={(text: string) => setPrivateKey(text)}
                    actions={(
                        <TextInputActionPaste onPaste={(value: string) => setPrivateKey(value)} />
                    )}
                />
            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('import_account')}
                    onPress={() => _import()}
                    icon={<Feather name="download" />}
                />
            </View>
        </Screen>
    );
}
