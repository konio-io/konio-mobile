import { Button, TextInput } from "../components"
import { useCallback, useEffect } from "react";
import { useCurrentAddress, useI18n, useW3W } from "../hooks";
import Loading from "./Loading";
import { SignClientTypes } from "@walletconnect/types";
import { View } from "react-native";
import { useHookstate } from "@hookstate/core";
import { useNavigation } from "@react-navigation/native";
import { DappHomeNavigationProp } from "../types/navigation";
import { createW3W, pair } from "../actions";

export default () => {
    const navigation = useNavigation<DappHomeNavigationProp>();
    const currentAddress = useCurrentAddress().get();
    if (!currentAddress) {
        return <Loading />
    }

    const W3W = useW3W();
    const CURI = useHookstate('');
    const i18n = useI18n();

    const onSessionProposal = useCallback(
        (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
            navigation.push('DappPair', {proposal});
        },
        []
    );

    const onSessionRequest = useCallback(
        async (request: SignClientTypes.EventArguments["session_request"]) => {
            navigation.push('DappSign', {request});
        },
        []
    );

    useEffect(() => {
        if (!W3W.get()) {
            createW3W(onSessionProposal, onSessionRequest);
        }
    }, [])

    return (
        <View>
            <TextInput
                onChangeText={(v: string) => CURI.set(v)}
                value={CURI.get()}
                placeholder="Enter WC URI (wc:1234...)"
            />
            <Button onPress={() => pair(CURI.get())} title="Pair Session" />
            <Button onPress={() => navigation.navigate('DappSessions')} title={i18n.t('sessions')} />
        </View>
    );
}

