import { useNavigation, DrawerActions } from "@react-navigation/native";
import { View, Pressable } from "react-native";
import { useCurrentAccount, useTheme } from "../hooks";
import Avatar from "./Avatar";

export default () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const currentAccount = useCurrentAccount();
    const { Spacing } = theme.vars;

    return (
        <View style={{ padding: Spacing.base }}>
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <Avatar size={36} address={currentAccount.address} />
            </Pressable>
        </View>
    )
}