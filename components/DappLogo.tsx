import { View, Image, StyleSheet } from "react-native";
import { useTheme } from "../hooks";
import { Dapp, Theme } from "../types/ui";
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
            {
                props.dapp.compatible &&
                <View style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: 'white', width: 24, height: 24, borderRadius: 24 }}>
                    <MaterialCommunityIcons name="check-decagram" size={24} color={'#1ea1f3'} />
                </View>
            }
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