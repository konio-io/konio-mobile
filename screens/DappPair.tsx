import { Screen, Wrapper, Button, Text } from "../components"
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DappPairNavigationProp, DappPairRouteProp } from "../types/navigation";
import { acceptProposal, rejectProposal } from "../actions";
import { useI18n, useTheme } from "../hooks";

export default () => {
    const navigation = useNavigation<DappPairNavigationProp>();
    const route = useRoute<DappPairRouteProp>();
    const proposal = route.params.proposal;
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const accept = async () => {
        await acceptProposal(proposal);
        navigation.goBack();
    }

    const reject = async () => {
        await rejectProposal(proposal);
        navigation.goBack();
    }

    const name = proposal?.params?.proposer?.metadata?.name;
    const url = proposal?.params?.proposer?.metadata?.url;
    const description = proposal?.params?.proposer?.metadata?.description;
    const methods = proposal?.params?.requiredNamespaces?.koinos?.methods;
    //const events = proposal.params.requiredNamespaces.koinos.events;
    //const chains = proposal.params.requiredNamespaces.koinos.chains;
    //const icons = proposal.params.proposer.metadata.icons;

    return (
        <Screen>
            <Wrapper>
                {
                    name &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('name')}</Text>
                        <Text>{name}</Text>
                    </View>
                }

                {
                    description &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('description')}</Text>
                        <Text>{description}</Text>
                    </View>
                }

                {
                    url &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('URL')}</Text>
                        <Text>{url}</Text>
                    </View>
                }

                {
                    methods &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('method')}</Text>
                        {methods.map(method =>
                            <Text key={method}>{method}</Text>
                        )}
                    </View>
                }
            </Wrapper>

            <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.columnGapBase }}>
                <Button style={styles.flex1} onPress={() => accept()} title={i18n.t('accept')} />
                <Button style={styles.flex1} onPress={() => reject()} title={i18n.t('reject')} />
            </View>
        </Screen>
    )
}

