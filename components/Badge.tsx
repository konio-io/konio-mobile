import { View } from "react-native"
import { TouchableHighlight } from "react-native-gesture-handler"
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
        <TouchableHighlight onPress={() => {
            if (props.onPress) {
                props.onPress();
            }
        }}>
            <View style={{ backgroundColor: props.backgroundColor, borderRadius: Border.radius, ...styles.paddingSmall }}>
                <Text style={{ ...styles.textSmall, color: props.color }}>{props.label}</Text>
            </View>
        </TouchableHighlight>
    )
}