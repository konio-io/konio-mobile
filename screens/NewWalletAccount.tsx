import { useHookstate } from '@hookstate/core';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { setCurrentWallet, addAccount, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { Button, TextInput, Wrapper } from '../components';
import i18n from '../locales';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const name = useHookstate('');

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
                showToast({
                    type: 'success',
                    text1: i18n.t('account_added', {name: name.get()})
                });

                setCurrentWallet(address);
                const action = CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'WalletStack' },
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
        <Wrapper>
            <TextInput
                value={name.get()}
                placeholder={i18n.t('account_name')}
                onChangeText={(text: string) => name.set(text)}
            />

            <Button
                title={i18n.t('add_account')}
                onPress={() => addWallet()}
                icon={<Feather name="plus"/>}
            />
        </Wrapper>
    );
}
