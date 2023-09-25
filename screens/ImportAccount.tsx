import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Screen, TextInputActionPaste } from '../components';
import { useI18n, useTheme } from '../hooks';
import { Keyboard, View } from 'react-native';
import { MAX_ACCOUNT } from '../lib/Constants';
import { useState } from 'react';
import { useStore } from '../stores';
import Toast from 'react-native-toast-message';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const [name, setName] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const { Secure, Account, Spinner, Log, Setting } = useStore();
    const accounts = Secure.state.accounts.get();

    const _import = () => {
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

        Spinner.actions.showSpinner();

        Account.actions.importAccount({
            name: name.trim(),
            privateKey: privateKey.trim()
        })
            .then(address => {
                Spinner.actions.hideSpinner();
                Setting.actions.setCurrentAccount(address);
                navigation.goBack();
            })
            .catch(e => {
                Spinner.actions.hideSpinner();
                Log.actions.logError(e);
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
