import { Modal, View, Image, Text, Button, StyleSheet } from "react-native";
import { web3wallet } from "../lib/WalletConnectUtils";
import {utils} from 'ethers';
import { UserStore } from "../stores";
import { getSigner } from "../lib/utils";
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { getSdkError } from '@walletconnect/utils'

interface SignModalProps {
  visible: boolean;
  setModalVisible: (arg1: boolean) => void;
  requestSession: any;
  requestEvent: SignClientTypes.EventArguments["session_request"] | undefined;
}

export function convertHexToUtf8(value: string) {
  if (utils.isHexString(value)) {
    return utils.toUtf8String(value);
  }

  return value;
}

export function getSignParamsMessage(params: string[]) {
  const message = params.filter(p => !utils.isAddress(p))[0];

  return convertHexToUtf8(message);
}

export default function SignModal({
  visible,
  setModalVisible,
  requestEvent,
  requestSession,
}: SignModalProps) {
  // CurrentProposal values

  if (!requestEvent || !requestSession) return null;

  const chainID = requestEvent?.params?.chainId?.toUpperCase();
  const method = requestEvent?.params?.request?.method;
  //const message = getSignParamsMessage(requestEvent?.params?.request?.params);
  const message = 'empty'

  const requestName = requestSession?.peer?.metadata?.name;
  const requestIcon = requestSession?.peer?.metadata?.icons[0];
  const requestURL = requestSession?.peer?.metadata?.url;

  const { topic } = requestEvent;

  async function onApprove() {
    if (requestEvent) {
      const { params, id } = requestEvent;
      const networkId = UserStore.currentNetworkId.get();
      const address = UserStore.currentAddress.get();

      if (!address) {
        return;
      }

      const signer = getSigner({
        address,
        networkId
      });

      const transaction = await signer.signTransaction(requestEvent.params.request.params.transaction);
      if (transaction.signatures && transaction.signatures.length > 0) {
        const response = formatJsonRpcResult(id, transaction.signatures[0])
        await web3wallet.respondSessionRequest({
          topic,
          response,
        });
        setModalVisible(false);
      }
    }
  }

  async function onReject() {
    if (requestEvent) {
      const { id } = requestEvent;
      const response = formatJsonRpcError(id, getSdkError('USER_REJECTED').message)
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      setModalVisible(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContentContainer}>
          <Image
            style={styles.dappLogo}
            source={{
              uri: requestIcon,
            }}
          />

          <Text>{requestName}</Text>
          <Text>{requestURL}</Text>

          <Text>{message}</Text>

          <Text>Chains: {chainID}</Text>

          <View style={styles.marginVertical8}>
            <Text style={styles.subHeading}>Method:</Text>
            <Text>{method}</Text>
          </View>

          <View style={{ display: "flex", flexDirection: "row" }}>
            <Button onPress={() => onReject()} title="Cancel" />
            <Button onPress={() => onApprove()} title="Accept" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContentContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 34,
    borderWidth: 1,
    width: "100%",
    height: "50%",
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
  },
  dappLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginVertical: 4,
  },
  marginVertical8: {
    marginVertical: 8,
  },
  subHeading: {
    textAlign: "center",
    fontWeight: "600",
  },
});