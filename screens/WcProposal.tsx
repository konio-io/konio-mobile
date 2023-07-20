import { Screen, Wrapper, Button, Text, AccountListItem } from "../components"
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WcProposalNavigationProp, WcProposalRouteProp } from "../types/navigation";
import { acceptProposal, rejectProposal, showToast } from "../actions";
import { useCurrentAddress, useI18n, useTheme } from "../hooks";
import { State } from "@hookstate/core";

export default () => {
    const navigation = useNavigation<WcProposalNavigationProp>();
    const route = useRoute<WcProposalRouteProp>();
    const proposal = route.params.proposal;
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const currentAddress = useCurrentAddress();
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return <></>;
    }

    const accept = async () => {
        acceptProposal(proposal)
            .then(() => {
                showToast({
                    type: 'success',
                    text1: i18n.t('dapp_proposal_success')
                });
            })
            .catch(e => {
                showToast({
                    type: 'error',
                    text1: i18n.t('dapp_proposal_error')
                });
            });
        navigation.goBack();
    }

    const reject = async () => {
        rejectProposal(proposal);
        navigation.goBack();
    }

    const name = proposal?.params?.proposer?.metadata?.name;
    const url = proposal?.params?.proposer?.metadata?.url;
    const description = proposal?.params?.proposer?.metadata?.description;
    const methods = proposal?.params?.requiredNamespaces?.koinos?.methods;
    //const icons = proposal.params.proposer.metadata.icons;


    return (
        <Screen>
            <Wrapper>

                <Text style={styles.textMedium}>{i18n.t('dapp_proposal_desc')}</Text>

                <View style={{ width: '100%', height: 70 }}>
                    <Text style={styles.textSmall}>{i18n.t('account')}</Text>
                    <AccountListItem address={currentAddressOrNull.get()} />
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
                            <Text key={method}>{method}</Text>
                        )}
                    </View>
                }
            </Wrapper>

            <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.columnGapBase }}>
                <Button type="secondary" style={styles.flex1} onPress={() => reject()} title={i18n.t('reject')} />
                <Button style={styles.flex1} onPress={() => accept()} title={i18n.t('accept')} />
            </View>
        </Screen>
    )
}

