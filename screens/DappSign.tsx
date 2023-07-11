import { Button, Screen, Wrapper, Text } from "../components"
import { useCurrentAddress, useI18n, useTheme, useW3W } from "../hooks";
import Loading from "./Loading";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { DappSignNavigationProp, DappSignRouteProp } from "../types/navigation";
import { acceptRequest, rejectRequest } from "../actions";

export default () => {
    const navigation = useNavigation<DappSignNavigationProp>();
    const route = useRoute<DappSignRouteProp>();
    const request = route.params.request;
    const w3wallet = useW3W().get();
    const currentAddress = useCurrentAddress().get();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    if (!currentAddress || !w3wallet || !request) {
        return <Loading />
    }

    const accept = async () => {
        acceptRequest(request);
        navigation.goBack();
    }

    const reject = async () => {
        rejectRequest(request);
        navigation.goBack();
    }

    const data = w3wallet.engine.signClient.session.get(request.topic);
    const name = data?.peer?.metadata?.name;
    const description = data?.peer?.metadata?.description;
    const url = data?.peer?.metadata?.url;
    const method = request.params.request.method;

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
                    method &&
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('method')}</Text>
                        <Text>{method}</Text>
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

