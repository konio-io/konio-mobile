import { Screen, AccountListItem, Separator, ListItemSelected } from "../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { WithdrawSelectToNavigationProp, WithdrawSelectToRouteProp } from "../types/navigation";
import { useCurrentAddress, useWallets } from "../hooks";
import { FlatList } from "react-native";

export default () => {
    const currentAddress = useCurrentAddress();
    const data = useWallets().get().filter(w => w.address !== currentAddress.get());

    return (
        <Screen>
            <FlatList
                data={data}
                renderItem={({ item }) => <ListItem address={item.address} />}
                ItemSeparatorComponent={() => <Separator />}
            />
        </Screen>
    );
}  

const ListItem = (props: {
    address: string,
}) => {
    const route = useRoute<WithdrawSelectToRouteProp>();
    const navigation = useNavigation<WithdrawSelectToNavigationProp>();
    const selected = props.address === route.params.selected;

    return (
        <ListItemSelected
            ItemComponent={() => <AccountListItem address={props.address}/>}
            selected={selected}
            onPress={() => {
                navigation.navigate('WithdrawTo', { to: props.address, contractId: route.params.contractId })
            }}
        />
    )
}
