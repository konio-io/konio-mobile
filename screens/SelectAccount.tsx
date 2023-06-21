import { ListItemSelected, WalletAvatar, WalletList, Wrapper, Text } from "../components"
import { useNavigation } from "@react-navigation/native"
import { SelectAccountNavigationProp } from "../types/navigation";
import { useCurrentAddress, useTheme, useWallet, useWithdraw } from "../hooks";
import { View } from "react-native";
import { setWithdrawAddress } from "../actions";

export default () => {
    const navigation = useNavigation<SelectAccountNavigationProp>();
    const withdraw = useWithdraw();
    const selected = withdraw.address.get();

    return (
        <Wrapper type="full">
            <List selected={selected} onSelect={(address: string) => {
                setWithdrawAddress(address);
                navigation.goBack();
            }}/>
        </Wrapper>
    );
}

const List = (props: {
    selected?: string,
    onSelect: Function
}) => {

    const currentAddress = useCurrentAddress();
    const filter = (address: string) => address !== currentAddress.get();

    return (
        <WalletList 
            filter={filter}
            renderItem={(address: string) => {
                return <ListItem
                    address={address}
                    selected={props.selected === address}
                    onPress={props.onSelect}
                />
            }
        } />
    )
}

const ListItem = (props: {
    address: string,
    selected: boolean,
    onPress: Function
}) => {

    const wallet = useWallet(props.address).get();
    const theme = useTheme();
    const { Spacing } = theme.vars;
    
    const ItemComponent = () => (
        <View style={{flex: 1, flexDirection: 'row', columnGap: Spacing.base, alignItems: 'center' }}>
            <WalletAvatar size={36} address={wallet.address} name={wallet.name} />
            <Text>{wallet.name}</Text>
        </View>
    );

    return <ListItemSelected 
        ItemComponent={ItemComponent}
        selected={props.selected} 
        onPress={() => props.onPress(props.address)}
    />
}