import { View } from "react-native";
import { WalletList, ListItemSelected, Wrapper, Text, WalletAvatar } from "../components";
import { useCurrentAddress, useTheme, useWallet } from "../hooks";
import { setCurrentWallet } from "../actions";
import { useNavigation } from "@react-navigation/native";
import type { SwitchAccountNavigationProp } from "../types/navigation";

export default () => {
    const currentAddress = useCurrentAddress();
    
    return (
        <Wrapper type="full">
            <WalletList renderItem={(address: string) => {
                return <ListItem address={address} selected={currentAddress.get() === address}/>
            }}/>
        </Wrapper>
    )
}

const ListItem = (props: {
    address: string,
    selected: boolean
}) => {

    const navigation = useNavigation<SwitchAccountNavigationProp>();
    const wallet = useWallet(props.address).get();
    const theme = useTheme().get();
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
        onPress={() => {
            setCurrentWallet(props.address);
            navigation.goBack();
        }}
    />
}