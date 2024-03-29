import { Button, Link } from '../components';
import { ScrollView, View } from "react-native";
import { useI18n, useLockState, useTheme } from '../hooks';
import RecipientInput from '../components/RecipientInput';
import { Feather } from '@expo/vector-icons';
import AssetNftInput from '../components/AssetNftInput';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SettingsNavigationProp, WithdrawNavigationProp } from '../types/navigation';
import { useHookstate } from '@hookstate/core';
import { SettingStore, NftStore, SpinnerStore, LogStore, LockStore } from '../stores';
import Toast from 'react-native-toast-message';
import { SheetManager } from 'react-native-actions-sheet';

export default (props: {
    nftId?: string,
    to?: string
}) => {
    const navigation = useNavigation<WithdrawNavigationProp>();
    const settingNavigation = useNavigation<SettingsNavigationProp>();
    const currentAccountState = useHookstate(SettingStore.state.currentAccountId);
    const currentNetworkState = useHookstate(SettingStore.state.currentNetworkId);
    const i18n = useI18n();
    const theme = useTheme();
    const [to, setTo] = useState<string | undefined>();
    const [nftId, setNftId] = useState<string | undefined>();
    const lockState = useLockState();
    const [sendRequest, setSendRequest] = useState(false);

    useEffect(() => {
        _reset();
    }, [currentAccountState, currentNetworkState]);

    useEffect(() => {
        if (lockState.get() === false && sendRequest === true) {
            _send();
        }
    }, [lockState]);

    useEffect(() => {
        if (props.nftId) {
            setNftId(props.nftId);
        }
        if (props.to) {
            setTo(props.to);
        }
    }, [props])


    const _reset = () => {
        setTo(undefined);
        setNftId(undefined);
    }

    const _confirm = () => {
        LockStore.actions.lock();
        setSendRequest(true);
    };

    const _send = () => {
        if (!to || !nftId) {
            return;
        }

        SpinnerStore.actions.showSpinner();

        NftStore.actions.withdrawNft({
            id: nftId,
            to
        })
            .then(() => {
                //withdraw confirmation
                NftStore.actions.withdrawNftConfirm(nftId)
                    .then(() => {
                        SpinnerStore.actions.hideSpinner();
                        navigation.goBack();

                        Toast.show({
                            type: 'success',
                            text1: i18n.t('transaction_confirmed'),
                        });
                        SettingStore.actions.showAskReview();
                    })
                    .catch(e => {
                        SpinnerStore.actions.hideSpinner();
                        LogStore.actions.logError(e);
                        Toast.show({
                            type: 'error',
                            text1: i18n.t('nft_transfer_failed'),
                            text2: i18n.t('check_logs'),
                            onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
                        });
                    });
            })
            .catch(e => {
                SpinnerStore.actions.hideSpinner();
                LogStore.actions.logError(e);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('nft_transfer_failed'),
                    text2: i18n.t('check_logs'),
                    onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
                });
            });
    }


    return (
        <View style={{ flex: 1, ...theme.styles.paddingBase }}>
            <ScrollView contentContainerStyle={theme.styles.rowGapBase}>
                <RecipientInput
                    value={to}
                    onChange={(address: string) => setTo(address)}
                />

                <AssetNftInput
                    nftId={nftId}
                    onChange={(value: string) => setNftId(value)}
                    opened={to !== undefined && nftId === undefined}
                />

                <View style={theme.styles.alignCenterColumn}>
                    <Link text={i18n.t('advanced_options')} onPress={() => SheetManager.show("fee")}/>
                </View>

            </ScrollView>

            {
                to && nftId &&
                <Button
                    title={i18n.t('send')}
                    onPress={() => _confirm()}
                    icon={<Feather name="arrow-up-right" />}
                />
            }
        </View>
    );
}