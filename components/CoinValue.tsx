import { View } from "react-native";
import Text from "./Text";
import ActivityIndicator from "./ActivityIndicator";
import { useCoinValue, useTheme } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";

export default (props: {
    contractId: string
}) => {
    const coinValue = useCoinValue(props.contractId);
    const formattedPrice = useHookstate('');
    const theme = useTheme();
    const styles = theme.styles;

    useEffect(() => {
        if (coinValue.get() !== undefined) {
            formattedPrice.set( `${coinValue.get().toFixed(2).toString()} USD` );
        } else {
            formattedPrice.set('--');
        }
    }, [coinValue])

    return (
        <View>
            { formattedPrice.get() &&
                <Text style={styles.textMedium}>{formattedPrice.get()}</Text>
            }
            { !formattedPrice.get() &&
                <ActivityIndicator />
            }
        </View>
    );
}