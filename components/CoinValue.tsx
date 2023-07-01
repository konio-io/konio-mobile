import { View } from "react-native";
import Text from "./Text";
import ActivityIndicator from "./ActivityIndicator";
import { useCoinValue } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";

export default (props: {
    contractId: string
}) => {
    const coinValue = useCoinValue(props.contractId);
    const formattedPrice = useHookstate('');

    useEffect(() => {
        if (coinValue.get() !== undefined) {
            formattedPrice.set( coinValue.get().toFixed(2).toString() );
        }
    }, [coinValue])

    return (
        <View>
            {coinValue.get() !== undefined &&
                <Text>{formattedPrice.get()} USD</Text>
            }
            {coinValue.get() === undefined &&
                <ActivityIndicator />
            }
        </View>
    );
}