import { Button } from '../components';
import { ScrollView, View } from "react-native";
import { useCurrentAddress, useCurrentNetworkId, useI18n, useLockState, useTheme } from '../hooks';
import RecipientInput from '../components/RecipientInput';
import AmountInput from '../components/AmountInput';
import { Feather } from '@expo/vector-icons';
import AssetCoinInput from '../components/AssetCoinInput';
import { askReview, withdrawCoinConfirm, hideSpinner, lock, logError, showSpinner, showToast, withdrawCoin } from '../actions';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { WithdrawNavigationProp } from '../types/navigation';
import { useEffect, useState } from 'react';

export default (props: {
    contractId?: string
}) => {
    const currentAddress = useCurrentAddress();
    const currentNetworkId = useCurrentNetworkId();
    const [to, setTo] = useState<string|undefined>(undefined);
    const [contractId, setContractId] = useState(props.contractId);
    const [amount, setAmount] = useState(0);
    const [sendRequest, setSendRequest] = useState(false);
    const i18n = useI18n();
    const theme = useTheme();
    const navigation = useNavigation<WithdrawNavigationProp>();
    const lockState = useLockState();

    useEffect(() => {
        _reset();
    }, [currentAddress, currentNetworkId]);

    useEffect(() => {
        if (lockState.get() === false && sendRequest === true) {
            _send();
        }
    }, [lockState]);

    const _reset = () => {
        setAmount(0);
        setContractId(undefined);
        setTo(undefined);
    };

    const _confirm = () => {
        lock();
        setSendRequest(true);
    };

    const _send = () => {
        if (!to || !contractId || !amount) {
            return;
        }

        showSpinner();

        withdrawCoin({
            to,
            contractId,
            value: amount.toString(),
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

                withdrawCoinConfirm({
                    contractId,
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
                    value={to}
                    onChange={(value: string) => setTo(value)}
                />

                <AssetCoinInput
                    value={contractId}
                    onChange={(value: string) => setContractId(value)}
                    opened={to !== undefined && contractId === undefined ? true : false}
                />

                {
                    contractId !== undefined &&
                    <AmountInput
                        contractId={contractId}
                        value={amount}
                        onChange={(value: number) => setAmount(value)}
                        opened={contractId ? true : false}
                    />
                }

            </ScrollView>

            {
                to && contractId && amount !== undefined && amount > 0 &&
                <Button
                    title={i18n.t('send')}
                    onPress={() => _confirm()}
                    icon={<Feather name="arrow-up-right" />}
                />
            }

        </View>
    );
}