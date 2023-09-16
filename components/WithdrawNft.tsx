import { useHookstate } from '@hookstate/core';
import { Button} from '../components';
import { ScrollView, View } from "react-native";
import { useCurrentAddress, useCurrentNetworkId, useI18n, useLock, useTheme } from '../hooks';
import RecipientInput from '../components/RecipientInput';
import { Feather } from '@expo/vector-icons';
import AssetNftInput from '../components/AssetNftInput';
import { askReview, hideSpinner, lock, logError, showSpinner, showToast, withdrawNft, withdrawNftConfirm } from '../actions';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { WithdrawAssetNavigationProp } from '../types/navigation';

export default (props: {
    to?: string,
    from: string,
    networkId: string,
    contractId?: string,
    tokenId?: string
}) => {
    const i18n = useI18n();
    const theme = useTheme();
    const to = useHookstate('');
    const nft = useHookstate({
        tokenId: props.tokenId ?? '',
        contractId: props.contractId ?? ''
    });
    const lockState = useLock();
    const sendRequest = useHookstate(false);
    const navigation = useNavigation<WithdrawAssetNavigationProp>();
    
    /*const currentAddress = useCurrentAddress();
    const currentNetworkId = useCurrentNetworkId();

    useEffect(() => {
        _reset();
    }, [currentAddress, currentNetworkId]);*/

    useEffect(() => {
        if (lockState.get() === false && sendRequest.get() === true) {
            _send();
        }
    }, [lockState]);

    const _reset = () => {
        to.set('');
        nft.set({
            tokenId: '',
            contractId: ''
        });
    }

    const _confirm = () => {
        lock();
        sendRequest.set(true);
    };

    const _send = () => {
        showSpinner();

        withdrawNft({
            contractId: nft.contractId.get(),
            tokenId: nft.tokenId.get(),
            to: to.get()
        })
        .then(() => {
            //withdraw confirmation
            withdrawNftConfirm({
                contractId: nft.contractId.get(),
                tokenId: nft.tokenId.get(),
                to: to.get()
            }).then(() => {
                hideSpinner();
                navigation.goBack();

                showToast({
                    type: 'success',
                    text1: i18n.t('transaction_confirmed'),
                });
                askReview();
            })
            .catch(e => {
                hideSpinner();
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('nft_transfer_failed'),
                    text2: i18n.t('check_logs')
                });
            });
        })
        .catch(e => {
            hideSpinner();
            logError(e);
            showToast({
                type: 'error',
                text1: i18n.t('nft_transfer_failed'),
                text2: i18n.t('check_logs')
            });  
        });
    }

    return (
        <View style={{ flex: 1, ...theme.styles.paddingBase }}>
            <ScrollView contentContainerStyle={theme.styles.rowGapBase}>
                <RecipientInput
                    address={to.get()}
                    onChange={(address: string) => to.set(address)}
                />
                {
                    to.get() &&
                    <AssetNftInput
                        nft={nft.get()}
                        onChange={(value: any) => nft.set({
                            tokenId: value.tokenId,
                            contractId: value.contractId
                        })}
                        opened={!nft.tokenId.get()}
                    />
                }
            </ScrollView>

            {
                to.get() && nft.tokenId.get() &&
                <Button
                    title={i18n.t('send')}
                    onPress={() => _confirm()}
                    icon={<Feather name="arrow-up-right" />}
                />
            }
        </View>
    );
}