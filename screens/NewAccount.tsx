import { useHookstate } from '@hookstate/core';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { setCurrentWallet, addAccount, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Wrapper, Screen } from '../components';
import { useI18n, useTheme } from '../hooks';
import { View } from 'react-native';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const addWallet = () => {
        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_account_name')
            });
            return;
        }

        addAccount(name.get().trim())
            .then(address => {
                setCurrentWallet(address);
                const action = CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'AccountStack' },
                    ]
                });
                navigation.dispatch(action);
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
            <Wrapper type="full">
                <TextInput
                    autoFocus={true}
                    value={name.get()}
                    placeholder={i18n.t('account_name')}
                    onChangeText={(text: string) => name.set(text)}
                />
            </Wrapper>

            <View style={styles.screenFooter}>
                <Button
                    title={i18n.t('add_account')}
                    onPress={() => addWallet()}
                    icon={<Feather name="plus" />}
                />
            </View>
        </Screen>
    );
}
