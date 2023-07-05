import { FlatList, View } from "react-native";
import { ListItemSelected, Screen, AccountListItem, Separator, Link } from "../components";
import { useCurrentAddress, useI18n, useTheme, useWallets } from "../hooks";
import { setCurrentWallet } from "../actions";
import { useNavigation } from "@react-navigation/native";
import type { SwitchAccountNavigationProp } from "../types/navigation";
import { SheetManager } from "react-native-actions-sheet";

export default () => {
    const data = Object.values(useWallets().get());

    return (
        <Screen>
            <FlatList
                data={data}
                renderItem={({ item }) => <ListItem address={item.address}/>}
                ItemSeparatorComponent={() => <Separator />}
            />
            <Footer />
        </Screen>
    );
}

const ListItem = (props: {
    address: string
}) => {
    const navigation = useNavigation<SwitchAccountNavigationProp>();
    const currentAddress = useCurrentAddress().get();
    const selected = currentAddress === props.address;

    return (
        <ListItemSelected
            ItemComponent={() => <AccountListItem address={props.address} />}
            selected={selected}
            onPress={() => {
                setCurrentWallet(props.address);
                navigation.goBack();
            }}
            onLongPress={() => SheetManager.show('account', {payload: {address: props.address}})}
        />
    )
};

const Footer = () => {
    const navigation = useNavigation<SwitchAccountNavigationProp>();
    const theme = useTheme();
    const { Spacing } = theme.vars;
    const i18n = useI18n();

    return (
        <View style={{ alignItems: 'center', padding: Spacing.base }}>
            <Link text={i18n.t('add_account')} onPress={() => navigation.navigate('NewAccount')} />
        </View>
    );
};