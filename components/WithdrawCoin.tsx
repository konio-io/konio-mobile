import { Button } from '../components';
import { ScrollView, View } from "react-native";
import { useI18n, useLockState, useTheme } from '../hooks';
import RecipientInput from '../components/RecipientInput';
import AmountInput from '../components/AmountInput';
import { Feather } from '@expo/vector-icons';
import AssetCoinInput from '../components/AssetCoinInput';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { WithdrawNavigationProp } from '../types/navigation';
import { useEffect, useState } from 'react';
import { SettingStore, LockStore, SpinnerStore, CoinStore, LogStore } from '../stores';
import { useHookstate } from '@hookstate/core';
import Toast from 'react-native-toast-message';

export default (props: {
    coinId?: string
}) => {
    const currentAccountState = useHookstate(SettingStore.state.currentAccountId);
    const currentNetworkState = useHookstate(SettingStore.state.currentNetworkId);

    const [to, setTo] = useState<string|undefined>(undefined);
    const [coinId, setCoinId] = useState(props.coinId);
    const [amount, setAmount] = useState(0);
    const [sendRequest, setSendRequest] = useState(false);
    const i18n = useI18n();
    const theme = useTheme();
    const navigation = useNavigation<WithdrawNavigationProp>();
    const lockState = useLockState();

    useEffect(() => {
        _reset();
    }, [currentAccountState, currentNetworkState]);

    useEffect(() => {
        if (lockState.get() === false && sendRequest === true) {
            _send();
        }
    }, [lockState]);

    const _reset = () => {
        setAmount(0);
        setCoinId(undefined);
        setTo(undefined);
    };

    const _confirm = () => {
        LockStore.actions.lock();
        setSendRequest(true);
    };

    const _send = () => {
        if (!to || !coinId || !amount) {
            return;
        }

        SpinnerStore.actions.showSpinner();

        CoinStore.actions.withdrawCoin({
            to,
            id: coinId,
            value: amount.toString(),
            note: ''
        })
            .then(transaction => {
                SpinnerStore.actions.hideSpinner();

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
                                                coinId
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                    })
                );

                Toast.show({
                    type: 'info',
                    text1: i18n.t('transaction_committed'),
                });

                CoinStore.actions.withdrawCoinConfirm({
                    id: coinId,
                    transaction
                }).then(tsx => {
                    Toast.show({
                        type: 'success',
                        text1: i18n.t('transaction_confirmed'),
                    });
                    SettingStore.actions.showAskReview();
                })
                    .catch(e => {
                        LogStore.actions.logError(e)
                        Toast.show({
                            type: 'error',
                            text1: i18n.t('transaction_confirm_failed'),
                            text2: i18n.t('check_logs')
                        });
                    });
            })
            .catch(e => {
                SpinnerStore.actions.hideSpinner();
                LogStore.actions.logError(e);
                Toast.show({
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
                    value={coinId}
                    onChange={(value: string) => setCoinId(value)}
                    opened={to !== undefined && coinId === undefined ? true : false}
                />

                {
                    coinId !== undefined &&
                    <AmountInput
                        coinId={coinId}
                        value={amount}
                        onChange={(value: number) => setAmount(value)}
                        opened={coinId ? true : false}
                    />
                }

            </ScrollView>

            {
                to && coinId && amount !== undefined && amount > 0 &&
                <Button
                    title={i18n.t('send')}
                    onPress={() => _confirm()}
                    icon={<Feather name="arrow-up-right" />}
                />
            }

        </View>
    );
}