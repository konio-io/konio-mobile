import { View } from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import { Text, Button, Wrapper, Screen, Seed } from '../components';
import { addSeed, logError, refreshCoins, setCurrentAccount, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { NewWalletSeedConfirmRouteProp } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';

export default () => {
    const route = useRoute<NewWalletSeedConfirmRouteProp>();
    const { name, seed } = route.params;
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const addWord = (list: State<Array<string>>, word: string) => {
        list.merge([word]);
    };

    const removeWord = (list: State<Array<string>>, word: string) => {
        const filteredList = list.get().filter(w => w !== word);
        list.set(filteredList);
    };

    const shuffleArray = (array: Array<string>) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    const addWallet = () => {
        if (seed !== sortedWords.get().join(' ')) {
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
                setCurrentAccount(address);
            })
            .catch(e => {
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('unable_to_add_wallet'),
                    text2: i18n.t('generate_new_one')
                });
            });
    };

    const words = seed.split(' ');
    shuffleArray(words);
    const unsortedWords = useHookstate(words);

    const sortedWordsDefault: Array<string> = [];
    const sortedWords = useHookstate(sortedWordsDefault);

    return (
        <Screen>
            <Wrapper>
                <Text>{i18n.t('confirm_wallet_seed')}</Text>

                <View style={styles.textInputContainer}>
                    <Seed phrase={sortedWords.get().join(' ')} onWordClick={(word: string) => {
                        removeWord(sortedWords, word);
                        addWord(unsortedWords, word);
                    }} />
                </View>

                <Seed phrase={unsortedWords.get().join(' ')} onWordClick={(word: string) => {
                    removeWord(unsortedWords, word);
                    addWord(sortedWords, word);
                }} />
            </Wrapper>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('confirm')}
                    icon={<Feather name="check" />}
                    onPress={() => addWallet()}
                />
            </View>
        </Screen>

    );
}