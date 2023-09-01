import { Screen, Text, Separator, Button, ActivityIndicator, Accordion, AccountAvatar, Link } from "../components"
import { useCallback, useEffect } from "react";
import { getSdkError } from "@walletconnect/utils";
import { ImmutableObject, none, useHookstate } from "@hookstate/core";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { useI18n, useTheme, useWC, useAccount } from "../hooks";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { WcSessionsNavigationProp } from "../types/navigation";
import { refreshWCActiveSessions } from "../actions";
import { SessionTypes } from "@walletconnect/types";

export default () => {
    const wc = useWC();
    const wallet = wc.wallet.get();
    const activeSessions = wc.activeSessions.get();
    const i18n = useI18n();
    const { styles } = useTheme();
    const navigation = useNavigation<WcSessionsNavigationProp>();

    if (!wallet) {
        return <Loading />;
    }

    const disconnect = async (topic: string) => {
        await wallet.disconnectSession({
            topic,
            reason: getSdkError("USER_DISCONNECTED"),
        });
        refreshWCActiveSessions();
    }

    useEffect(() => {
        refreshWCActiveSessions();
    }, []);

    const data = Object.values(activeSessions)
        .sort((a, b) => a.expiry < b.expiry ? 1 : -1);

    return (
        <Screen>
            <FlatList
                data={data}
                renderItem={({ item }) => <DappSession item={item} onPress={(topic: string) => disconnect(topic)} />}
                ItemSeparatorComponent={() => <Separator />}
            />

            <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
                <Link text={i18n.t('new_connection')} onPress={() => navigation.navigate('WcPairScan')} />
            </View>
        </Screen>
    );
}

const DappSession = (props: {
    item: ImmutableObject<SessionTypes.Struct>
    onPress: Function
}) => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const expiryDate = new Date(props.item.expiry * 1000);
    const expiry = `${expiryDate.toLocaleDateString()} ${expiryDate.toLocaleTimeString()}`;

    const name = props.item?.peer?.metadata?.name;
    const description = props.item?.peer?.metadata?.description;
    const url = props.item?.peer?.metadata?.url;
    const account = props.item?.namespaces.koinos?.accounts[0]?.split(':')[2];

    return (
        
            <Accordion header={(<ItemHeader address={account} name={name} />)}>
                <View style={{ ...styles.rowGapBase, ...styles.flex1, ...styles.paddingBase, paddingTop: 0 }}>
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

                    <View>
                        <Text style={styles.textSmall}>{i18n.t('dapp_connection_expiry')}</Text>
                        <Text>{expiry}</Text>
                    </View>

                    <Button
                        icon={(<AntDesign name="disconnect" />)}
                        type="secondary"
                        title={i18n.t('disconnect')}
                        onPress={() => props.onPress(props.item.topic)}
                    />
                </View>
            </Accordion>
        
    );
}

const ItemHeader = (props: {
    address: string,
    name: string
}) => {
    const account = useAccount(props.address).get();
    const theme = useTheme();
    const styles = theme.styles;

    return (
        <View style={{ ...styles.directionRow, ...styles.alignSpaceBetweenRow, ...styles.alignCenterColumn, ...styles.paddingBase }}>
            <View style={{ ...styles.directionRow, ...styles.columnGapBase, ...styles.alignCenterColumn }}>
                <AccountAvatar address={props.address} size={36} />
                <Text>{account.name}</Text>
            </View>
            <View>
                <Text>{props.name}</Text>
            </View>
        </View>
    );
}