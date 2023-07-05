import { View, StyleSheet } from "react-native";
import AccountAvatar from "./AccountAvatar";
import Text from "./Text";
import { useTheme, useWallet } from "../hooks";
import Address from "./Address";
import type { Theme } from "../types/store";

export default (props: {
    address: string
}) => {

    const wallet = useWallet(props.address).get();
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <AccountAvatar size={36} address={props.address} />
            <View>
                <Text>{wallet.name}</Text>
                <Address address={props.address} compress={true} copiable={true}/>
            </View>
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            flex: 1,
            flexDirection: 'row',
            columnGap: Spacing.base,
            alignItems: 'center'
        }
    });
}