import { Keyboard, View } from 'react-native';
import { Text, Button, Wrapper, Screen, Seed } from '../components';
import { addSeed, hideSpinner, logError, setCurrentAccount, showSpinner, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { NewWalletSeedConfirmRouteProp } from '../types/navigation';
import { useTheme, useI18n } from '../hooks';
import { useState } from 'react';

export default () => {
    const route = useRoute<NewWalletSeedConfirmRouteProp>();
    const { name, seed } = route.params;
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const shuffleArray = (array: Array<string>) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    const addWallet = () => {
        Keyboard.dismiss();

        if (seed !== sortedWords.join(' ')) {
            showToast({
                type: 'error',
                text1: i18n.t('invalid_seed')
            });
            return;
        }

        showSpinner();

        addSeed({
            name: name,
            seed: seed
        })
            .then(address => {
                hideSpinner();
                setCurrentAccount(address);
            })
            .catch(e => {
                hideSpinner();
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
    const [unsortedWords, setUnsortedWords] = useState(words);

    const sortedWordsDefault: Array<string> = [];
    const [sortedWords, setSortedWords] = useState(sortedWordsDefault);

    return (
        <Screen keyboardDismiss={true}>
            <Wrapper>
                <Text>{i18n.t('confirm_wallet_seed')}</Text>

                <View style={styles.textInputContainer}>
                    <Seed phrase={sortedWords.join(' ')} onWordClick={(word: string) => {
                        setSortedWords( sortedWords.filter(w => w !== word) )
                        setUnsortedWords( [...unsortedWords, word] );
                    }} />
                </View>

                <Seed phrase={unsortedWords.join(' ')} onWordClick={(word: string) => {
                    setUnsortedWords( unsortedWords.filter(w => w !== word) );
                    setSortedWords( [...sortedWords, word ] );
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