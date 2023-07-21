import { Screen, Wrapper, Button, Text, AccountListItem } from "../components"
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WcProposalNavigationProp, WcProposalRouteProp } from "../types/navigation";
import { acceptProposal, logError, rejectProposal, showToast } from "../actions";
import { useCurrentAddress, useCurrentNetworkId, useI18n, useNetwork, useTheme } from "../hooks";
import { State, useHookstate } from "@hookstate/core";
import { useEffect } from "react";
import { checkWCMethod, checkWCNetwork, getNetworkByChainId } from "../lib/WalletConnect";
import { Feather } from '@expo/vector-icons';

export default () => {
    const currentAddress = useCurrentAddress();
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return <></>;
    }

    const currentNetworkId = useCurrentNetworkId().get();
    const currentNetwork = useNetwork(currentNetworkId).get();
    const navigation = useNavigation<WcProposalNavigationProp>();
    const route = useRoute<WcProposalRouteProp>();
    const proposal = route.params.proposal;
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const checkMethods = useHookstate(true);
    const checkNetwork = useHookstate(true);

    //data
    const name = proposal?.params?.proposer?.metadata?.name;
    const url = proposal?.params?.proposer?.metadata?.url;
    const description = proposal?.params?.proposer?.metadata?.description;
    const methods = proposal?.params?.requiredNamespaces?.koinos?.methods;
    const chains = proposal?.params?.requiredNamespaces?.koinos?.chains ?? ['unknown'];
    const requiredNetwork = getNetworkByChainId(chains[0]);
    const requiredNetworkName = requiredNetwork ? requiredNetwork.name : i18n.t('unknown');

    const _checkMethods = () => {
        for (const method of methods) {
            if (!checkWCMethod(method)) {
                checkMethods.set(false);
            }
        }
    }

    const _checkNetwork = () => {
        if (!checkWCNetwork(chains[0])) {
            checkNetwork.set(false);
        }
    }

    const accept = () => {
        acceptProposal(proposal)
            .then(() => {
                showToast({
                    type: 'success',
                    text1: i18n.t('dapp_proposal_success')
                });
            })
            .catch(e => {
                logError(e);
                showToast({
                    type: 'error',
                    text1: i18n.t('dapp_proposal_error')
                });
            });
        navigation.goBack();
    }

    const reject = () => {
        rejectProposal(proposal)
            .catch(e => logError(e));

        navigation.goBack();
    }

    useEffect(() => {
        _checkMethods();
        _checkNetwork();
    }, [route.params.proposal])

    //const icons = proposal.params.proposer.metadata.icons;

    return (
        <Screen>
            <Wrapper>
                <Text style={styles.textMedium}>{i18n.t('dapp_proposal_desc')}</Text>

                <View style={{ width: '100%', height: 70 }}>
                    <Text style={styles.textSmall}>{i18n.t('account')}</Text>
                    <AccountListItem address={currentAddressOrNull.get()} />
                </View>

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
                    methods &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_method')}</Text>
                        {methods.map(method =>
                            <Text key={method}>{method.replace('koinos_', '')}</Text>
                        )}
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
                <Button type="secondary"
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

