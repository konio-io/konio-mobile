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

export default () => {
    const currentAddress = useCurrentAddress().get();
    if (!currentAddress) {
        return <Loading />
    }

    const [currentWCURI, setCurrentWCURI] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [currentProposal, setCurrentProposal] = useState();
    const [successfulSession, setSuccessfulSession] = useState(false);

    //Add Initialization
    useInitialization();

    const onSessionProposal = useCallback(
        (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
            setModalVisible(true);
            setCurrentProposal(proposal);
        },
        []
    );

    async function pair() {
        const pairing = await web3WalletPair({ uri: currentWCURI });
        return pairing;
    }

    async function handleAccept() {
        console.log('handleAccept')
        const { id, params } = currentProposal;
        const { requiredNamespaces, relays } = params;

        if (currentProposal) {
            const namespaces: SessionTypes.Namespaces = {};
            Object.keys(requiredNamespaces).forEach((key) => {
                const accounts: string[] = [];
                requiredNamespaces[key].chains.map((chain) => {
                    [currentAddress].map((acc) => accounts.push(`${chain}:${acc}`));
                });

                namespaces[key] = {
                    accounts,
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
        console.log('handleReject')
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

    // Adjust your UseEffect

    useEffect(() => {
        web3wallet?.on("session_proposal", onSessionProposal);
    }, [
        pair,
        handleAccept,
        handleReject,
        currentAddress,
        onSessionProposal,
        successfulSession,
    ]);


    return (
        <Screen>
            <Wrapper>
                <Text>{currentAddress}</Text>

                <TextInput
                    onChangeText={setCurrentWCURI}
                    value={currentWCURI}
                    placeholder="Enter WC URI (wc:1234...)"
                />
                <Button onPress={() => pair()} title="Pair Session" />


                <PairingModal
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                    visible={modalVisible}
                    setModalVisible={setModalVisible}
                    currentProposal={currentProposal}
                />
            </Wrapper>

        </Screen>
    )
}

