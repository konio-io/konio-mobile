import { Screen, Text, Separator, Button } from "../components"
import { useCallback, useEffect } from "react";
import { getSdkError } from "@walletconnect/utils";
import { ImmutableObject, none, useHookstate } from "@hookstate/core";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native";
import { useI18n, useTheme, useW3W } from "../hooks";
import { SessionTypes } from "@walletconnect/types";
import Loading from "./Loading";

export default () => {
    const activeSessions = useHookstate<Record<string, SessionTypes.Struct>>({});
    const web3wallet = useW3W().get();

    if (!web3wallet) {
        return <Loading />
    }

    const onStart = useCallback(async () => {
        activeSessions.set(await web3wallet.getActiveSessions());
    }, []);

    useEffect(() => {
        onStart();
    }, []);

    //ToDo: onRefresh
    const disconnect = async (topic: string) => {
        await web3wallet.disconnectSession({
            topic,
            reason: getSdkError("USER_DISCONNECTED"),
        });
        activeSessions[topic].set(none);
    }

    const data = Object.values(activeSessions.get())
        .sort((a, b) => a.expiry < b.expiry ? 1 : -1);

    return (
        <Screen>
            <FlatList
                data={data}
                renderItem={({ item }) => <DappSession item={item} onPress={(topic: string) => disconnect(topic)} />}
                ItemSeparatorComponent={() => <Separator />}
            />
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

    return (
        <View style={{...styles.rowGapBase, ...styles.paddingBase}}>

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

            <Button type="secondary" title={i18n.t('disconnect')} onPress={() => props.onPress(props.item.topic)} />
            <Separator/>
        </View>
    );
}