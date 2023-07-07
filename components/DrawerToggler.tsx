import { useNavigation, DrawerActions } from "@react-navigation/native";
import { View, Pressable } from "react-native";
import { useCurrentAddress, useTheme } from "../hooks";
import AccountAvatar from "./AccountAvatar";
import { State } from "@hookstate/core";

export default () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const currentAddress = useCurrentAddress();
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return <></>;
    }

    const { Spacing } = theme.vars;

    return (
        <View style={{ padding: Spacing.base }}>
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <AccountAvatar size={36} address={currentAddressOrNull.get()} />
            </Pressable>
        </View>
    )
}