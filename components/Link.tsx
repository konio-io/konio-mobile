import { Pressable } from "react-native";
import Text from "./Text";
import { useTheme } from "../hooks";

export default (props: {
    onPress: Function,
    text: string
}) => {
    const {styles} = useTheme();

    return (
        <Pressable onPress={() => props.onPress()}>
            <Text style={styles.link}>{props.text}</Text>
        </Pressable>
    );
}