import { Button, Screen, Wrapper, Text, AccountListItem } from "../components"
import { useCurrentAddress, useI18n, useTheme, useW3W, useAccount, useCurrentNetworkId, useNetwork } from "../hooks";
import Loading from "./Loading";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WcRequestNavigationProp, WcRequestRouteProp } from "../types/navigation";
import { acceptRequest, logError, rejectRequest, showToast } from "../actions";
import { checkWCMethod, checkWCNetwork, getNetworkByChainId } from "../lib/WalletConnect";
import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";
import { Feather } from '@expo/vector-icons';

export default () => {
    const w3wallet = useW3W().get();
    const currentAddress = useCurrentAddress().get();
    if (!currentAddress || !w3wallet) {
        return <Loading />
    }

    const currentNetworkId = useCurrentNetworkId().get();
    const currentNetwork = useNetwork(currentNetworkId).get();
    const navigation = useNavigation<WcRequestNavigationProp>();
    const route = useRoute<WcRequestRouteProp>();
    const request = route.params.request;
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const checkMethods = useHookstate(true);
    const checkNetwork = useHookstate(true);

    //data
    const data = w3wallet.engine.signClient.session.get(request.topic);
    const name = data?.peer?.metadata?.name;
    const description = data?.peer?.metadata?.description;
    const url = data?.peer?.metadata?.url;
    const method = request.params.request.method;
    const address = data.namespaces.koinos?.accounts[0]?.split(':')[2];
    const account = useAccount(address);
    const chainId = route.params.request.params.chainId;
    const requiredNetwork = getNetworkByChainId(chainId);
    const requiredNetworkName = requiredNetwork ? requiredNetwork.name : i18n.t('unknown');

    const _checkMethods = () => {
        if (!checkWCMethod(method)) {
            checkMethods.set(false);
        }
    }

    const _checkNetwork = () => {
        if (!checkWCNetwork(chainId)) {
            checkNetwork.set(false);
        }
    }

    const accept = async () => {
        acceptRequest(request)
            .then(() => {
                showToast({
                    type: 'success',
                    text1: i18n.t('dapp_request_success')
                });
            })
            .catch(e => {
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('dapp_request_error', { method }),
                    text2: i18n.t('check_logs')
                })
            });

        navigation.goBack();
    }

    const reject = async () => {
        rejectRequest(request)
            .catch(e => logError(e));
        navigation.goBack();
    }

    useEffect(() => {
        _checkMethods();
        _checkNetwork();
    }, [route.params.request]);

    return (
        <Screen>
            <Wrapper>

                <Text style={styles.textMedium}>{i18n.t('dapp_request_desc')}</Text>

                {
                    account.ornull &&
                    <View style={{ width: '100%', height: 70 }}>
                        <Text style={styles.textSmall}>{i18n.t('account')}</Text>
                        <AccountListItem address={address} />
                    </View>
                }

                <View>
                    <Text style={styles.textSmall}>{i18n.t('network')}</Text>
                    <Text>{requiredNetworkName}</Text>
                </View>

                {
                    name &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_name')}</Text>
                        <Text>{name}</Text>
                    </View>
                }

                {
                    description &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_description')}</Text>
                        <Text>{description}</Text>
                    </View>
                }

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
                        <Text>{method.replace('koinos_', '')}</Text>
                    </View>
                }
            </Wrapper>

            {
                checkMethods.get() === false &&
                <View style={{ ...styles.paddingBase, ...styles.columnGapBase, ...styles.alignCenterColumn }}>
                    <Text style={{ ...styles.textError, ...styles.textCenter }}>{i18n.t('unsupported_methods')}</Text>
                </View>
            }

            {
                checkNetwork.get() === false &&
                <View style={{ ...styles.paddingBase, ...styles.columnGapBase, ...styles.alignCenterColumn }}>
                    <Text style={{ ...styles.textError, ...styles.textCenter }}>{i18n.t('invalid_network', { currentNetwork: currentNetwork.name, requiredNetwork: requiredNetworkName })}</Text>
                </View>
            }

            <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.columnGapBase }}>
                <Button
                    type="secondary"
                    style={styles.flex1}
                    onPress={() => reject()}
                    title={i18n.t('reject')}
                    icon={(<Feather name="x" />)}
                />
                {
                    checkMethods.get() === true &&
                    checkNetwork.get() === true &&
                    <Button
                        style={styles.flex1}
                        onPress={() => accept()}
                        title={i18n.t('accept')}
                        icon={(<Feather name="check" />)}
                    />
                }
            </View>

        </Screen>
    )
}

