import { View } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Text, Button, TextInput, Wrapper } from '../components';
import { addSeed, setCurrentWallet, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { NewWalletSeedConfirmRouteProp } from '../types/navigation';
import i18n from '../locales';

export default () => {
    const route = useRoute<NewWalletSeedConfirmRouteProp>();
    const { name, seed } = route.params;
    const confirmSeed = useHookstate('');

    const addWallet = () => {
        if (seed !== confirmSeed.get().trim()) {
            showToast({
                type: 'error',
                text1: i18n.t('invalid_seed')
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
                    text1: i18n.t('account_added', {name: name})
                });
            })
            .catch(e => {
                console.log(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('unable_to_add_wallet'),
                    text2: i18n.t('generate_new_one')
                });
            });

    };

    return (
        <Wrapper>

            <Text>{i18n.t('confirm_wallet_seed')}</Text>

            <TextInput
                multiline={true}
                numberOfLines={4}
                value={confirmSeed.get()}
                onChangeText={(v:string) => confirmSeed.set(v.toLocaleLowerCase())}
            />

            <View>
                <Button
                    title={i18n.t('add')}
                    icon={<Feather name="plus"/>}
                    onPress={() => addWallet()}
                />
            </View>

        </Wrapper>
    );
}
