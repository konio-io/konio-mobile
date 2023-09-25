import { Button, Text, AccountAvatar } from "../components"
import { ScrollView, View, Image, StyleSheet } from "react-native";
import { useCurrentAccount, useCurrentNetwork, useI18n, useTheme } from "../hooks";
import { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import type { Theme } from "../types/ui";
import { useStore } from "../stores";
import Toast from "react-native-toast-message";

export default (props: SheetProps) => {
    const proposal = props.payload.proposal;
    
    const { Network, WalletConnect, Log } = useStore();
    const account = useCurrentAccount();
    const network = useCurrentNetwork();
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color } = theme.vars;
    const i18n = useI18n();
    const [checkMethods, setCheckMethods] = useState(true);
    const [checkNetwork, setCheckNetwork] = useState(true);

    //data
    const name = proposal?.params?.proposer?.metadata?.name;
    const url = proposal?.params?.proposer?.metadata?.url;
    const description = proposal?.params?.proposer?.metadata?.description;
    const methods = proposal?.params?.requiredNamespaces?.koinos?.methods;
    const chains = proposal?.params?.requiredNamespaces?.koinos?.chains ?? ['unknown'];
    const requiredNetwork = Network.getters.getNetworkByChainId(chains[0]);
    const requiredNetworkName = requiredNetwork ? requiredNetwork.name : i18n.t('unknown');
    const icons = proposal.params.proposer.metadata.icons;

    const _checkMethods = () => {
        for (const method of methods) {
            if (!WalletConnect.getters.checkMethod(method)) {
                setCheckMethods(false);
            }
        }
    }

    const _checkNetwork = () => {
        if (!WalletConnect.getters.checkNetwork(chains[0])) {
            setCheckNetwork(false);
        }
    }

    const accept = () => {
        WalletConnect.actions.acceptProposal(proposal)
            .then(() => {
                Toast.show({
                    type: 'success',
                    text1: i18n.t('dapp_proposal_success')
                });
                SheetManager.hide('wc_proposal');
            })
            .catch(e => {
                Log.actions.logError(e);
                Toast.show({
                    type: 'error',
                    text1: i18n.t('dapp_proposal_error')
                });
                SheetManager.hide('wc_proposal');
            });
    }

    const reject = () => {
        WalletConnect.actions.rejectProposal(proposal)
            .catch(e => Log.actions.logError(e));

        SheetManager.hide('wc_proposal');
    }

    useEffect(() => {
        _checkMethods();
        _checkNetwork();
    }, [proposal]);

    return (
        <ActionSheet id={props.sheetId} containerStyle={styles.container} closeOnTouchBackdrop={false}>
            <ScrollView contentContainerStyle={{ ...styles.paddingMedium, ...styles.rowGapMedium }}>

                {
                    account !== undefined &&
                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                        <AccountAvatar size={24} address={account.address} />
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

                <Text style={styles.textMedium}>{i18n.t('dapp_proposal_desc', { dappName: name ?? 'Unknown Dapp' })}</Text>

                {
                    url &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_URL')}</Text>
                        <Text>{url}</Text>
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
                    methods &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_method')}</Text>
                        {methods.map((method: string) =>
                            <View key={method}>
                                {
                                    WalletConnect.getters.checkMethod(method) &&
                                    <Text style={styles.textSuccess}><Feather name="check-circle" size={16} color={Color.success} /> {i18n.t(method.replace('koinos_', ''))}</Text>
                                }

                                {
                                    !WalletConnect.getters.checkMethod(method) &&
                                    <Text style={styles.textError}><Feather name="x-circle" size={16} color={Color.error} /> {i18n.t(method.replace('koinos_', ''))}</Text>
                                }
                            </View>
                        )}
                    </View>
                }
            </ScrollView>

            {
                checkMethods === false &&
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

            <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.columnGapBase }}>
                <Button type="secondary"
                    style={styles.flex1}
                    onPress={() => reject()}
                    title={i18n.t('reject')}
                    icon={(<Feather name="x" />)}
                />
                {
                    checkMethods === true &&
                    checkNetwork === true &&
                    <Button
                        style={styles.flex1}
                        onPress={() => accept()}
                        title={i18n.t('accept')}
                        icon={(<Feather name="check" />)}
                    />
                }
            </View>

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