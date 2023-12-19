import { Button, Text, Avatar, Link } from "../components"
import { useI18n, useTheme, useCurrentAccount, useCurrentNetwork } from "../hooks";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { WC_METHODS } from "../lib/Constants";
import Loading from "../screens/Loading";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import type { Theme } from "../types/ui";
import { WalletConnectStore, NetworkStore, SettingStore, LogStore } from "../stores";
import Toast from "react-native-toast-message";
import ActionSheet from "./ActionSheet";
import SendTransactionDetail from "../components/SendTransactionDetail";
import SignMessageDetail from "../components/SignMessageDetail";

export default (props: SheetProps) => {
    const wallet = WalletConnectStore.state.wallet.get();
    if (!wallet) {
        return <Loading />
    }

    const account = useCurrentAccount();
    const network = useCurrentNetwork();

    const request = props.payload.request;
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color } = theme.vars;
    const i18n = useI18n();
    const [checkMethod, setCheckMethod] = useState(true);
    const [checkNetwork, setCheckNetwork] = useState(true);
    const [checkAddress, setCheckAddress] = useState(true);

    //data
    const data = wallet.engine.signClient.session.get(request.topic);
    const name = data?.peer?.metadata?.name;
    //const description = data?.peer?.metadata?.description;
    const url = data?.peer?.metadata?.url;
    const method = request.params.request.method;
    const chainId = request.params.chainId;
    const requiredNetwork = NetworkStore.getters.getNetworkByChainId(chainId);
    const requiredNetworkName = requiredNetwork ? requiredNetwork.name : i18n.t('unknown');
    const requiredAddress = data.namespaces.koinos?.accounts[0]?.split(':')[2];
    const icons = data?.peer?.metadata?.icons;

    const _checkAddress = () => {
        if (account.address !== requiredAddress) {
            setCheckAddress(false);
        }
    }

    const _checkMethod = () => {
        if (!WalletConnectStore.getters.checkMethod(method)) {
            setCheckMethod(false);
        }
    }

    const _checkNetwork = () => {
        if (!WalletConnectStore.getters.checkNetwork(chainId)) {
            setCheckNetwork(false);
        }
    }

    const accept = async () => {
        WalletConnectStore.actions.acceptRequest(request)
            .then(() => {
                SheetManager.hide('wc_request');
                Toast.show({
                    type: 'success',
                    text1: i18n.t('dapp_request_success')
                });
                SettingStore.actions.showAskReview();
            })
            .catch(e => {
                SheetManager.hide('wc_request');
                LogStore.actions.logError(e);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('dapp_request_error', { method }),
                    text2: i18n.t('check_logs')
                })
            });
    }

    const reject = async () => {
        WalletConnectStore.actions.rejectRequest(request)
            .catch(e => LogStore.actions.logError(e))

        SheetManager.hide('wc_request');
    }

    useEffect(() => {
        _checkMethod();
        _checkNetwork();
        _checkAddress();
    }, [request]);

    return (
        <ActionSheet id={props.sheetId} containerStyle={styles.container} closeOnTouchBackdrop={false}>
            <ScrollView contentContainerStyle={{ ...styles.paddingMedium, ...styles.rowGapMedium }}>

                {
                    account &&
                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                        <Avatar size={24} address={account.address} />
                        <Text>{account.name}</Text>
                    </View>
                }

                {
                    icons.length > 0 && !icons[0].includes('.svg') &&
                    <View style={styles.alignCenterColumn}>

                        <Image
                            style={{
                                width: 100,
                                height: 100,
                                resizeMode: 'contain',
                            }}
                            source={{
                                uri: icons[0],
                            }}
                        />

                    </View>
                }

                <Text style={styles.textMedium}>{i18n.t('dapp_request_desc', { dappName: name ?? 'Unknown Dapp' })}</Text>

                {
                    url &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_URL')}</Text>
                        <Text>{url}</Text>
                    </View>
                }

                {
                    method &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_method')}</Text>
                        {
                            checkMethod === true &&
                            <Text style={styles.textSuccess}><Feather name="check-circle" size={16} color={Color.success} /> {i18n.t(method.replace('koinos_', ''))}</Text>
                        }

                        {
                            checkMethod === false &&
                            <Text style={styles.textError}><Feather name="x-circle" size={16} color={Color.error} /> {i18n.t(method.replace('koinos_', ''))}</Text>
                        }
                    </View>
                }


                {
                    method === WC_METHODS.SIGN_MESSAGE &&
                    <SignMessageDetail message={request.params.request.params.message} />
                }

                {
                    [
                        WC_METHODS.SIGN_TRANSACTION,
                        WC_METHODS.SEND_TRANSACTION,
                        WC_METHODS.SIGN_AND_SEND_TRANSACTION
                    ].includes(method) &&
                    <SendTransactionDetail transaction={request.params.request.params.transaction} />
                }

                <View style={theme.styles.alignCenterColumn}>
                    <Link text={i18n.t('advanced_options')} onPress={async () => {
                        SheetManager.hide(props.sheetId)
                        .then(() => {
                            SheetManager.show("fee")
                            .then(() => {
                                SheetManager.show('wc_request', { payload: { request } });
                            });
                        });
                        
                    }} />
                </View>

            </ScrollView>

            {
                checkMethod === false &&
                <View style={{ ...styles.paddingBase, ...styles.columnGapBase, ...styles.alignCenterColumn }}>
                    <Text style={{ ...styles.textError, ...styles.textCenter }}>{i18n.t('unsupported_methods')}</Text>
                </View>
            }

            {
                checkNetwork === false &&
                <View style={{ ...styles.paddingBase, ...styles.columnGapBase, ...styles.alignCenterColumn }}>
                    <Text style={{ ...styles.textError, ...styles.textCenter }}>{i18n.t('misaligned_network', { currentNetwork: network?.name, requiredNetwork: requiredNetworkName })}</Text>
                </View>
            }

            {
                checkAddress === false &&
                <View style={{ ...styles.paddingBase, ...styles.columnGapBase, ...styles.alignCenterColumn }}>
                    <Text style={{ ...styles.textError, ...styles.textCenter }}>{i18n.t('misaligned_address', { currentAddress: account.address, requiredAddress: requiredAddress })}</Text>
                </View>
            }

            {
                (checkMethod === false ||
                    checkNetwork === false ||
                    checkAddress === false) &&

                <View style={{ ...styles.paddingBase }}>
                    <Button
                        type="secondary"
                        onPress={() => SheetManager.hide('wc_request')}
                        title={i18n.t('cancel')}
                        icon={(<Feather name="x" />)}
                    />
                </View>
            }

            {
                checkMethod === true &&
                checkNetwork === true &&
                checkAddress === true &&
                <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.columnGapBase }}>
                    <Button
                        type="secondary"
                        style={styles.flex1}
                        onPress={() => reject()}
                        title={i18n.t('reject')}
                        icon={(<Feather name="x" />)}
                    />
                    <Button
                        style={styles.flex1}
                        onPress={() => accept()}
                        title={i18n.t('accept')}
                        icon={(<Feather name="check" />)}
                    />
                </View>
            }

        </ActionSheet>
    )
}

const createStyles = (theme: Theme) => {
    const { Color } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...styles,
        container: {
            backgroundColor: Color.base,
            ...styles.alignCenterRow,
            ...styles.paddingBase
        }
    });
}