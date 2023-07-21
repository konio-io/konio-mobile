import { Button, Screen, TextInput, Text, AccountAvatar, Address } from '../components';
import { useHookstate } from '@hookstate/core';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import { WithdrawConfirmNavigationProp, WithdrawConfirmRouteProp } from '../types/navigation';
import { withdrawCoin, confirmTransaction, showToast, logError } from '../actions'
import { Feather } from '@expo/vector-icons';
import { useCoin, useTheme, useI18n, useAccount, useContact } from '../hooks';
import { View, StyleSheet } from 'react-native';
import type { Theme } from '../types/store';

export default () => {
    const route = useRoute<WithdrawConfirmRouteProp>();
    const navigation = useNavigation<WithdrawConfirmNavigationProp>();

    const to = route.params.to;
    const amount = route.params.amount;
    const contractId = route.params.contractId;
    const note = useHookstate('');

    const toAccount = useAccount(to).get();
    const toContact = useContact(to).get();
    const coin = useCoin(contractId).get();
    const theme = useTheme();
    const i18n = useI18n();

    const styles = createStyles(theme);

    const send = () => {
        if (!to) {
            return;
        }

        withdrawCoin({
            to,
            contractId: contractId,
            value: amount.toString(),
            note: note.get()
        })
            .then(transaction => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: 'Assets',
                                state: {
                                    routes: [
                                        {
                                            name: "AssetsCoins"
                                        },
                                        {
                                            name: "Coin",
                                            params: {
                                                contractId
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                    })
                );

                showToast({
                    type: 'info',
                    text1: i18n.t('transaction_committed'),
                });

                confirmTransaction(transaction).then(tsx => {
                    showToast({
                        type: 'success',
                        text1: i18n.t('transaction_confirmed'),
                    });
                })
                    .catch(e => {
                        logError(e)
                        showToast({
                            type: 'error',
                            text1: i18n.t('transaction_confirm_failed'),
                            text2: i18n.t('check_logs')
                        });
                    });
            })
            .catch(e => {
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('transaction_commit_failed'),
                    text2: i18n.t('check_logs')
                });
            });
    };

    return (
        <Screen>
            <View style={{ ...styles.flex1, ...styles.paddingBase, ...styles.rowGapMedium }}>
                <View style={styles.rowGapSmall}>
                    <Text style={styles.textSmall}>{i18n.t('recipient')}</Text>
                    <View style={styles.recipientContainer}>
                        <AccountAvatar size={48} address={to} />
                        <View>
                            <Text>
                                {toAccount && toAccount.name}
                                {!toAccount && toContact && toContact.name}
                            </Text>
                            <Address address={to} length={10} />
                        </View>
                    </View>

                </View>

                <View>
                    <Text style={styles.textSmall}>{i18n.t('amount')}</Text>
                    <Text>{amount} {coin.symbol}</Text>
                </View>

                <TextInput
                    multiline={true}
                    autoFocus={true}
                    value={note.get()}
                    placeholder={i18n.t('note')}
                    onChangeText={(v: string) => note.set(v)}
                />
            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('send')}
                    onPress={send}
                    icon={<Feather name="arrow-up-right" />}
                />
            </View>
        </Screen>
    );
}


const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        recipientContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: Spacing.small
        }
    });
}