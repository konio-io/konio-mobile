import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { setCurrentAccount, addAccount, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Screen } from '../components';
import { useI18n, useTheme } from '../hooks';
import { View } from 'react-native';
import { EncryptedStore } from '../stores';
import { MAX_ACCOUNT } from '../lib/Constants';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const accounts = EncryptedStore.accounts;

    const add = () => {
        if (Object.keys(accounts).length >= MAX_ACCOUNT) {
            showToast({
                type: 'error',
                text1: i18n.t('max_accounts_reached', {max: MAX_ACCOUNT})
            });
            return;
        }

        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_account_name')
            });
            return;
        }

        addAccount(name.get().trim())
            .then(address => {
                setCurrentAccount(address);
                navigation.goBack();
            })
            .catch(e => {
                console.log(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('unable_to_add_account')
                });
            });

    };

    return (
        <Screen>
            <View style={{...styles.flex1, ...styles.paddingBase, ...styles.rowGapSmall}}>
                <TextInput
                    autoFocus={true}
                    value={name.get()}
                    placeholder={i18n.t('account_name')}
                    onChangeText={(text: string) => name.set(text)}
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
