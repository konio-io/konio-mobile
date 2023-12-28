import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp, SettingsNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Screen } from '../components';
import { useI18n, useTheme } from '../hooks';
import { Keyboard, View } from 'react-native';
import { MAX_ACCOUNT } from '../lib/Constants';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { AccountStore, SpinnerStore, SettingStore, LogStore } from '../stores';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const settingNavigation = useNavigation<SettingsNavigationProp>();
    
    const [name, setName] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const add = () => {
        Keyboard.dismiss();

        if (Object.keys(AccountStore.state.get()).length >= MAX_ACCOUNT) {
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

        setTimeout(() => {
            AccountStore.actions.addAccount(name.trim())
            .then(address => {
                SpinnerStore.actions.hideSpinner();
                SettingStore.actions.setCurrentAccount(address);
                navigation.goBack();
                SettingStore.actions.showAskReview();
            })
            .catch(e => {
                SpinnerStore.actions.hideSpinner();
                LogStore.actions.logError(e);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('unable_to_add_account'),
                    text2: i18n.t('check_logs'),
                    onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
                });
            });
        }, 1000);

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
