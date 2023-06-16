import { View } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Text, ButtonPrimary, TextInput, Wrapper } from '../components';
import { addSeed, setCurrentWallet, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import { useRoute } from '@react-navigation/native';
import { NewWalletSeedConfirmRouteProp } from '../types/navigation';

export default () => {
    const route = useRoute<NewWalletSeedConfirmRouteProp>();
    const { name, seed } = route.params;
    const confirmSeed = useHookstate('');
    const theme = useTheme().get();
    const { Color } = theme.vars;

    const addWallet = () => {
        if (seed !== confirmSeed.get().trim()) {
            showToast({
                type: 'error',
                text1: 'Invalid seed'
            });
            return;
        }

        addSeed({
            name: name,
            seed: seed
        })
            .then(address => {
                setCurrentWallet(address);
                showToast({
                    type: 'success',
                    text1: `Account "${name}" added`
                });
            })
            .catch(e => {
                console.log(e);
                showToast({
                    type: 'error',
                    text1: 'Unable to add wallet seed',
                    text2: 'Try to generate a new one.'
                });
            });

    };

    return (
        <Wrapper>

            <Text>Confirm your wallet seed:</Text>

            <TextInput
                multiline={true}
                numberOfLines={4}
                value={confirmSeed.get()}
                onChangeText={(v:string) => confirmSeed.set(v.toLocaleLowerCase())}
            />

            <View>
                <ButtonPrimary
                    title="Add"
                    icon={<Feather name="plus" size={18} color={Color.primaryContrast} />}
                    onPress={() => addWallet()}
                />
            </View>

        </Wrapper>
    );
}
