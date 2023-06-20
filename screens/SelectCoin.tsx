import { CoinList, CoinSymbol, ListItemSelected, Wrapper } from "../components"
import { useNavigation } from "@react-navigation/native"
import type { SelectCoinNavigationProp } from "../types/navigation";
import { useWithdraw } from "../hooks";
import { setWithdrawContractId } from "../actions";

export default () => {
    const navigation = useNavigation<SelectCoinNavigationProp>();
    const withdraw = useWithdraw();
    const withdrawContractId = withdraw.contractId.get();

    return (
        <Wrapper type="full">
            <List selected={withdrawContractId} onSelect={(contractId: string) => {
                setWithdrawContractId(contractId);
                navigation.navigate('SelectAmount');
            }}/>
        </Wrapper>
    );
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