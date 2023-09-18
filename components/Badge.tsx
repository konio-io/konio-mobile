import { View, TouchableOpacity } from "react-native"
import Text from "./Text"
import { useTheme } from "../hooks"

export default (props: {
    label: string,
    color: string,
    backgroundColor: string,
    onPress?: Function
}) => {

    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;

    return (
        <TouchableOpacity onPress={() => {
            if (props.onPress) {
                props.onPress();
            }
        }}>
            <View style={{ backgroundColor: props.backgroundColor, borderRadius: Border.radius, ...styles.paddingSmall, width: 'auto' }}>
                <Text style={{ ...styles.textSmall, color: props.color }}>{props.label}</Text>
            </View>
        </TouchableOpacity>
    )
}