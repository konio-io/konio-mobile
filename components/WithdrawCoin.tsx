import { useHookstate } from '@hookstate/core';
import { Button } from '../components';
import { ScrollView, View } from "react-native";
import { useI18n, useLock, useTheme } from '../hooks';
import RecipientInput from '../components/RecipientInput';
import AmountInput from '../components/AmountInput';
import { Feather } from '@expo/vector-icons';
import AssetCoinInput from '../components/AssetCoinInput';
import { askReview, confirmTransaction, hideSpinner, lock, logError, showSpinner, showToast, withdrawCoin } from '../actions';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { WithdrawNavigationProp } from '../types/navigation';
import { useEffect } from 'react';

export default (props: {
    to?: string,
    contractId?: string
}) => {
    const to = useHookstate(props.to ?? '');
    const contractId = useHookstate(props.contractId ?? '');
    const amount = useHookstate(0);
    const i18n = useI18n();
    const theme = useTheme();
    const navigation = useNavigation<WithdrawNavigationProp>();
    const lockState = useLock();
    const sendRequest = useHookstate(false);

    useEffect(() => {
        if (lockState.get() === false && sendRequest.get() === true) {
            _send();
        }
    }, [lockState]);

    const _confirm = () => {
        lock();
        sendRequest.set(true);
    };

    const _send = () => {
        showSpinner();

        withdrawCoin({
            to: to.get(),
            contractId: contractId.get(),
            value: amount.get().toString(),
            note: ''
        })
            .then(transaction => {
                hideSpinner();

                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            {
                                name: 'Holdings',
                                state: {
                                    routes: [
                                        {
                                            name: "Assets"
                                        },
                                        {
                                            name: "Coin",
                                            params: {
                                                contractId: contractId.get()
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

                confirmTransaction({
                    contractId: contractId.get(),
                    transaction
                }).then(tsx => {
                    showToast({
                        type: 'success',
                        text1: i18n.t('transaction_confirmed'),
                    });
                    askReview();
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
                hideSpinner();
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('transaction_commit_failed'),
                    text2: i18n.t('check_logs')
                });
            });
    };

    return (
        <View style={{ flex: 1, ...theme.styles.paddingBase }}>
            <ScrollView contentContainerStyle={theme.styles.rowGapBase}>

                <RecipientInput
                    address={to.get()}
                    onChange={(address: string) => to.set(address)}
                />

                {
                    to.get() &&
                    <AssetCoinInput
                        contractId={contractId.get()}
                        onChange={(value: string) => contractId.set(value)}
                        opened={!contractId.get()}
                    />
                }

                {
                    contractId.get() &&
                    <AmountInput
                        contractId={contractId.get()}
                        value={amount.get()}
                        onChange={(value: number) => amount.set(value)}
                        opened={!amount.get()}
                    />
                }
            </ScrollView>

            {
                to.get() && contractId.get() && amount.get() > 0 &&
                <Button
                    title={i18n.t('send')}
                    onPress={() => _confirm()}
                    icon={<Feather name="arrow-up-right" />}
                />
            }

        </View>
    );
}