import { Button, Link } from '../components';
import { Alert, ScrollView, View } from "react-native";
import { useI18n, useLockState, useTheme } from '../hooks';
import RecipientInput from '../components/RecipientInput';
import AmountInput from '../components/AmountInput';
import { Feather } from '@expo/vector-icons';
import AssetCoinInput from '../components/AssetCoinInput';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SettingsNavigationProp, WithdrawNavigationProp } from '../types/navigation';
import { useEffect, useState } from 'react';
import { SettingStore, LockStore, SpinnerStore, CoinStore, LogStore } from '../stores';
import { useHookstate } from '@hookstate/core';
import Toast from 'react-native-toast-message';
import { SheetManager } from 'react-native-actions-sheet';

export default (props: {
    coinId?: string,
    to?: string
}) => {
    const currentAccountState = useHookstate(SettingStore.state.currentAccountId);
    const currentNetworkState = useHookstate(SettingStore.state.currentNetworkId);

    const [to, setTo] = useState<string | undefined>(undefined);
    const [coinId, setCoinId] = useState<string | undefined>(undefined);
    const [amount, setAmount] = useState(0);
    const [sendRequest, setSendRequest] = useState(false);
    const i18n = useI18n();
    const theme = useTheme();
    const navigation = useNavigation<WithdrawNavigationProp>();
    const lockState = useLockState();
    const settingNavigation = useNavigation<SettingsNavigationProp>();

    useEffect(() => {
        _reset();
    }, [currentAccountState, currentNetworkState]);

    useEffect(() => {
        if (lockState.get() === false && sendRequest === true) {
            _send();
        }
    }, [lockState]);

    useEffect(() => {
        if (props.coinId) {
            setCoinId(props.coinId);
        }
        if (props.to) {
            setTo(props.to);
        }
    }, [props]);

    const _reset = () => {
        setAmount(0);
        setCoinId(undefined);
        setTo(undefined);
    };

    const _lock = () => {
        LockStore.actions.lock();
        setSendRequest(true);
    };

    const _confirm = () => {
        if (!to || !coinId || !amount) {
            return;
        }

        //check if "to" is valid (not valid if it is a contractId)
        const existentContractIds = Object.values(CoinStore.state.get()).map(item => item.contractId);
        if (to && existentContractIds.includes(to)) {
            Alert.alert(
                i18n.t('warning'),
                i18n.t('contract_as_to'),
                [
                    {
                        text: i18n.t('cancel'),
                        //onPress: () => console.log('cancel'),
                        style: 'cancel',
                    },
                    {
                        text: i18n.t('confirm'),
                        onPress: () => {
                            _lock();
                        }
                    },
                ],
                {
                    cancelable: true
                },
            );
        } else {
            _lock();
        }
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
                if (!transaction) {
                    throw new Error("Unable to return transaction");
                }

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
                            text2: i18n.t('check_logs'),
                            onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
                        });
                    });
            })
            .catch(e => {
                LogStore.actions.logError(e);
                SpinnerStore.actions.hideSpinner();
                Toast.show({
                    type: 'error',
                    text1: i18n.t('transaction_commit_failed'),
                    text2: i18n.t('check_logs'),
                    onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
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
                    opened={to !== undefined && coinId === undefined}
                />

                {
                    coinId !== undefined &&
                    <AmountInput
                        coinId={coinId}
                        value={amount}
                        onChange={(value: number) => setAmount(value)}
                        opened={coinId === undefined ? false : true}
                    />
                }

                <View style={theme.styles.alignCenterColumn}>
                    <Link text={i18n.t('advanced_options')} onPress={() => SheetManager.show("fee")}/>
                </View>

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