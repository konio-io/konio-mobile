import { TouchableHighlight, View } from "react-native";
import Text from "./Text";
import { Feather } from '@expo/vector-icons';
import { useTheme } from "../hooks";

export default (props: {
    title: string,
    name: string,
    description: string,
    onPress: Function
}) => {

    const theme = useTheme().get();
    const { Color } = theme.vars;
    const styles = theme.styles;

    return (
        <TouchableHighlight onPress={() => props.onPress(props.name)}>
            <View style={styles.listItemContainer}>

                <View>
                    <Text style={styles.listItemTitle}>{props.title}</Text>
                    <Text style={styles.textSmall}>{props.description}</Text>
                </View>

                <Feather name="arrow-right" size={24} color={Color.primary} />

            </View>
        </TouchableHighlight>
    )
};