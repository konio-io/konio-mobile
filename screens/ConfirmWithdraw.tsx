import { Button, Wrapper, TextInput, Text } from '../components';
import { useHookstate } from '@hookstate/core';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { ConfirmWithdrawNavigationProp } from '../types/navigation';
import { withdrawCoin, confirmTransaction, showToast } from '../actions'
import { Feather } from '@expo/vector-icons';
import { useCoin, useTheme, useWithdraw } from '../hooks';
import i18n from '../locales';
import { View } from 'react-native';

export default () => {
    const navigation = useNavigation<ConfirmWithdrawNavigationProp>();
    const note = useHookstate('');
    const theme = useTheme().get();
    const styles = theme.styles;

    const withdraw = useWithdraw();
    const { address, contractId, amount } = withdraw.get();
    const coin = useCoin(contractId);

    const send = () => {
        if (!address) {
            return;
        }

        withdrawCoin({
            to: address,
            contractId: contractId,
            value: amount.toString(),
            note: note.get()
        })
            .then(transaction => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Wallet' },
                            {
                                name: 'Coin',
                                params: { contractId },
                            },
                        ],
                    })
                );

                showToast({
                    type: 'success',
                    text1: i18n.t('transaction_committed'),
                });

                confirmTransaction(transaction).then(tsx => {
                    showToast({
                        type: 'success',
                        text1: i18n.t('transaction_confirmed'),
                    });
                })
                    .catch(e => {
                        console.log(e);
                        showToast({
                            type: 'error',
                            text1: i18n.t('transaction_confirm_failed')
                        });
                    });
            })
            .catch(e => {
                console.log(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('transaction_commit_failed')
                });
            });
    };

    return (
        <Wrapper>

            <View>
                <Text style={styles.textSmall}>{i18n.t('recipient')}</Text>
                <Text>{address}</Text>
            </View>

            <View>
                <Text style={styles.textSmall}>{i18n.t('amount')}</Text>
                <Text>{amount} {coin.symbol.get()}</Text>
            </View>


            <TextInput
                style={{ ...styles.textInputMultiline }}
                multiline={true}
                value={note.get()}
                placeholder={i18n.t('note')}
                onChangeText={(v: string) => note.set(v)}
            />

            <Button
                title={i18n.t('send')}
                onPress={send}
                icon={<Feather name="arrow-up-right" />}
            />

        </Wrapper>
    );
}