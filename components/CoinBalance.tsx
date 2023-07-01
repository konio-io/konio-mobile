import { View } from "react-native";
import Text from "./Text";
import ActivityIndicator from "./ActivityIndicator";
import { useCoinBalance } from "../hooks";
import { refreshCoinBalance } from "../actions";

export default (props: {
    contractId: string
}) => {
    const coinBalance = useCoinBalance(props.contractId);
    refreshCoinBalance(props.contractId);

    return (
        <View>
            {coinBalance.get() !== '' &&
                <Text>{coinBalance.get()}</Text>
            }
            {!coinBalance.get() &&
                <ActivityIndicator />
            }
        </View>
    );
}