import { CoinList, CoinListItem, ListItemSelected, Screen } from "../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { WithdrawSelectCoinNavigationProp, WithdrawSelectCoinRouteProp } from "../types/navigation";
import { View } from "react-native";

export default () => {
    return (
        <Screen>
            <CoinList renderItem={(contractId: string) => <ListItem contractId={contractId} />} />
        </Screen>
    );
}

const ListItem = (props: {
    contractId: string,
}) => {
    const route = useRoute<WithdrawSelectCoinRouteProp>();
    const navigation = useNavigation<WithdrawSelectCoinNavigationProp>();

    const ItemComponent = () => (
        <View style={{ flex: 1 }}>
            <CoinListItem contractId={props.contractId} />
        </View>
    );

    return <ListItemSelected
        ItemComponent={ItemComponent}
        selected={route.params.selected === props.contractId}
        onPress={() => {
            navigation.navigate('WithdrawAmount', {
                to: route.params.to,
                contractId: props.contractId
            });
        }}
    />
}