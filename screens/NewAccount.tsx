import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { setCurrentAccount, addAccount, showToast, logError, askReview, showSpinner, hideSpinner } from '../actions';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Screen } from '../components';
import { useI18n, useTheme } from '../hooks';
import { Keyboard, View } from 'react-native';
import { EncryptedStore } from '../stores';
import { MAX_ACCOUNT } from '../lib/Constants';
import { useState } from 'react';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const [name, setName] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const accounts = EncryptedStore.accounts;

    const add = () => {
        Keyboard.dismiss();

        if (Object.keys(accounts).length >= MAX_ACCOUNT) {
            showToast({
                type: 'error',
                text1: i18n.t('max_accounts_reached', {max: MAX_ACCOUNT})
            });
            return;
        }

        if (!name) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_account_name')
            });
            return;
        }

        showSpinner();

        addAccount(name.trim())
            .then(address => {
                hideSpinner();
                setCurrentAccount(address);
                navigation.goBack();
                askReview();
            })
            .catch(e => {
                hideSpinner();
                logError(e);
                showToast({
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
            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('add_account')}
                    onPress={() => add()}
                    icon={<Feather name="plus" />}
                />
            </View>
        </Screen>
    );
}
