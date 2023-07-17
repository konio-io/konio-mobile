import { Screen, Text, Separator, Button, ActivityIndicator, AccountListItem, Accordion, AccountAvatar, Link } from "../components"
import { useCallback } from "react";
import { getSdkError } from "@walletconnect/utils";
import { ImmutableObject, none, useHookstate } from "@hookstate/core";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { useI18n, useTheme, useW3W, useWallet } from "../hooks";
import { SessionTypes } from "@walletconnect/types";
import Loading from "./Loading";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
    const activeSessions = useHookstate<Record<string, SessionTypes.Struct>>({});
    const refreshing = useHookstate(false);
    const web3wallet = useW3W().get();
    const i18n = useI18n();
    const { styles } = useTheme();

    if (!web3wallet) {
        return <Loading />;
    }

    if (refreshing.get()) {
        return <ActivityIndicator />;
    }

    const load = () => {
        activeSessions.set(web3wallet.getActiveSessions());
    }

    const disconnect = async (topic: string) => {
        await web3wallet.disconnectSession({
            topic,
            reason: getSdkError("USER_DISCONNECTED"),
        });
        activeSessions[topic].set(none);
    }

    useFocusEffect(
        useCallback(() => {
            load()
        }, [])
    );

    const data = Object.values(activeSessions.get())
        .sort((a, b) => a.expiry < b.expiry ? 1 : -1);

    return (
        <Screen>
            <FlatList
                data={data}
                renderItem={({ item }) => <DappSession item={item} onPress={(topic: string) => disconnect(topic)} />}
                ItemSeparatorComponent={() => <Separator />}
            />

            <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
                <Link text={i18n.t('new_connection')} onPress={() => SheetManager.show('wc_pair')} />
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
            <View style={{ ...styles.rowGapBase }}>
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

                <View>
                    <Text style={styles.textSmall}>{i18n.t('expiry')}</Text>
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
    const wallet = useWallet(props.address).get();
    const theme = useTheme();
    const styles = theme.styles;

    return (
        <View style={{ ...styles.directionRow, ...styles.alignSpaceBetweenRow }}>
            <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                <AccountAvatar address={props.address} size={24} />
                <Text>{wallet.name}</Text>
            </View>
            <View>
                <Text>{props.name}</Text>
            </View>
        </View>
    );
}