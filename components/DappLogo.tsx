import { View, Image, StyleSheet } from "react-native";
import { useTheme } from "../hooks";
import { Dapp, Theme } from "../types/ui";

export default (props: {
    dapp: Dapp,
    size?: number
}) => {

    const size = props.size ?? 60;
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            <Image style={{...styles.itemIcon, height: size, width: size}} source={{ uri: props.dapp.icon }} />
        </View >
    )
}

const createStyles = (theme: Theme) => {
    const { Border } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        itemIcon: {
            padding: 1,
            borderRadius: Border.radius,
            borderWidth: Border.width,
            borderColor: Border.color
        }
    });
}