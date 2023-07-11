import { Button, Text, TextInput, Wrapper, Screen } from "../components"
import useInitialization, {
    web3wallet,
    web3WalletPair,
} from "../lib/WalletConnectUtils";
import { useCallback, useEffect, useState } from "react";
import { useCurrentAddress } from "../hooks";
import Loading from "./Loading";
import PairingModal from "./PairingModal";
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import SignModal from "./SigningModal";
import { View } from "react-native";

export default () => {
    const currentAddress = useCurrentAddress().get();
    if (!currentAddress) {
        return <Loading />
    }

    const [currentWCURI, setCurrentWCURI] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [currentProposal, setCurrentProposal] = useState();
    const [successfulSession, setSuccessfulSession] = useState(false);
    const [requestSession, setRequestSession] = useState();
    const [requestEventData, setRequestEventData] = useState();
    const [signModalVisible, setSignModalVisible] = useState(false);

    const onSessionProposal = useCallback(
        (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
            setModalVisible(true);
            setCurrentProposal(proposal);
        },
        []
    );

    const onSessionRequest = useCallback(
        async (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
            const { topic, params } = requestEvent;
            const { request } = params;
            const requestSessionData =
                web3wallet.engine.signClient.session.get(topic);

            if (request.method === 'koinos_signTransaction') {
                setRequestSession(requestSessionData);
                setRequestEventData(requestEvent);
                setSignModalVisible(true);
                return;
            }
        },
        []
    );

    //Add Initialization
    useInitialization(onSessionProposal, onSessionRequest);

    async function pair() {
        const pairing = await web3WalletPair({ uri: currentWCURI });
        return pairing;
    }

    async function handleAccept() {
        const { id, params } = currentProposal;
        const { requiredNamespaces, relays } = params;

        console.log(JSON.stringify(currentProposal));

        if (currentProposal) {
            const namespaces: SessionTypes.Namespaces = {};
            Object.keys(requiredNamespaces).forEach((key) => {
                const accounts: string[] = [];
                requiredNamespaces[key].chains.map((chain: string) => {
                    [currentAddress].map((acc) => accounts.push(`${chain}:${acc}`));
                });

                namespaces[key] = {
                    accounts,
                    chains: requiredNamespaces[key].chains,
                    methods: requiredNamespaces[key].methods,
                    events: requiredNamespaces[key].events,
                };
            });

            await web3wallet.approveSession({
                id,
                relayProtocol: relays[0].protocol,
                namespaces,
            });

            setModalVisible(false);
            setCurrentWCURI("");
            setCurrentProposal(undefined);
            setSuccessfulSession(true);
        }
    }

    async function handleReject() {

        const { id } = currentProposal;

        if (currentProposal) {
            await web3wallet.rejectSession({
                id,
                reason: getSdkError("USER_REJECTED_METHODS"),
            });

            setModalVisible(false);
            setCurrentWCURI("");
            setCurrentProposal(undefined);
        }
    }

    async function disconnect() {
        const activeSessions = await web3wallet.getActiveSessions();
        const topic = Object.values(activeSessions)[0].topic;

        if (activeSessions) {
            await web3wallet.disconnectSession({
                topic,
                reason: getSdkError("USER_DISCONNECTED"),
            });
        }
        setSuccessfulSession(false);
    }

    return (
        <Screen>
            <Wrapper>
                <Text>{currentAddress}</Text>

                {!successfulSession ? (
                    <View>
                        <TextInput
                            onChangeText={setCurrentWCURI}
                            value={currentWCURI}
                            placeholder="Enter WC URI (wc:1234...)"
                        />
                        <Button onPress={() => pair()} title="Pair Session" />
                    </View>
                ) : (
                    <Button onPress={() => disconnect()} title="Disconnect" />
                )}

                <PairingModal
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                    visible={modalVisible}
                    setModalVisible={setModalVisible}
                    currentProposal={currentProposal}
                />

                <SignModal
                    visible={signModalVisible}
                    setModalVisible={setSignModalVisible}
                    requestEvent={requestEventData}
                    requestSession={requestSession}
                />
            </Wrapper>

        </Screen>
    )
}

