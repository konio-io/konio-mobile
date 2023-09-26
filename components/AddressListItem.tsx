import { View } from "react-native";
import Avatar from "./Avatar";
import Text from "./Text";
import { useTheme } from "../hooks";
import Address from "./Address";

export default (props: {
    address: string
    name?: string
}) => {

    const theme = useTheme();
    const styles = theme.styles;

    return (
        <View style={{...styles.directionRow, ...styles.columnGapBase, ...styles.alignCenterColumn}}>
            <Avatar size={48} address={props.address} />
            <View>
                {props.name &&
                    <Text>{props.name}</Text>
                }
                <Address address={props.address} />
            </View>
        </View>
    );
}