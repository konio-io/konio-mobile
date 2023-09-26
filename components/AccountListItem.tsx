import { View, StyleSheet } from "react-native";
import Avatar from "./Avatar";
import Text from "./Text";
import { useTheme } from "../hooks";
import Address from "./Address";
import type { Theme } from "../types/ui";
import { AccountStore } from "../stores";
import { useHookstate } from "@hookstate/core";

export default (props: {
    accountId: string
}) => {
    const account = useHookstate(AccountStore.state.nested(props.accountId)).get();
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Avatar size={36} address={account.address} />
            <View>
                <Text>{account?.name}</Text>
                <Address address={account.address} copiable={true}/>
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