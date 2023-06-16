import { useHookstate } from '@hookstate/core';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { setCurrentWallet, addAccount, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import { ButtonPrimary, TextInput, Wrapper } from '../components';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const name = useHookstate('');

    const theme = useTheme().get();
    const { Color } = theme.vars;

    const addWallet = () => {
        if (!name.get()) {
            showToast({
                type: 'error',
                text1: 'Missing account name'
            });
            return;
        }

        addAccount(name.get().trim())
            .then(address => {
                showToast({
                    type: 'success',
                    text1: `Account "${name.get()}" added`
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
                    text1: 'Unable to add account'
                });
            });

    };

    return (
        <Wrapper>
            <TextInput
                value={name.get()}
                placeholder='Account name'
                onChangeText={(text: string) => name.set(text)}
            />

            <ButtonPrimary
                title="Add account"
                onPress={() => addWallet()}
                icon={<Feather name="plus" size={18} color={Color.primaryContrast} />}
            />
        </Wrapper>
    );
}
