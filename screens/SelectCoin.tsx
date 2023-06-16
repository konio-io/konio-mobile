import { CoinList, CoinSymbol, ListItemSelected, Wrapper } from "../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { SelectCoinNavigationProp, SelectCoinRouteProp } from "../types/navigation";

export default () => {
    const navigation = useNavigation<SelectCoinNavigationProp>();
    const route = useRoute<SelectCoinRouteProp>();
    const selected = route.params ? route.params.selected : undefined;

    return (
        <Wrapper type="full">
            <List selected={selected} onSelect={(contractId: string) => {
                navigation.navigate('Withdraw', { contractId });
            }}/>
        </Wrapper>
    )
}

const List = (props: {
    selected?: string,
    onSelect: Function
}) => {
    return (
        <CoinList renderItem={(contractId: string) => {
            return <ListItem
                contractId={contractId}
                selected={props.selected === contractId}
                onPress={props.onSelect}
            />
        }} />
    )
}

const ListItem = (props: {
    contractId: string,
    selected: boolean,
    onPress: Function
}) => {
    const ItemComponent = () => (
        <CoinSymbol contractId={props.contractId} />
    );

    return <ListItemSelected
        ItemComponent={ItemComponent}
        selected={props.selected}
        onPress={() => props.onPress(props.contractId)}
    />
}