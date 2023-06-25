import { View } from "react-native";
import Text from "./Text";
import ActivityIndicator from "./ActivityIndicator";
import { useCoinValue } from "../hooks";

export default (props: {
    contractId: string
}) => {
    const coinValue = useCoinValue(props.contractId);
    const formattedPrice = coinValue.get().toFixed(2).toString();

    return (
        <View>
            {coinValue.get() !== undefined &&
                <Text>{formattedPrice} USD</Text>
            }
            {coinValue.get() === undefined &&
                <ActivityIndicator />
            }
        </View>
    );
}