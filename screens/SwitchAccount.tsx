import { Pressable, View } from "react-native";
import { WalletList, ListItemSelected, Wrapper, Text, WalletAvatar } from "../components";
import { useCurrentAddress, useI18n, useTheme, useWallet } from "../hooks";
import { setCurrentWallet } from "../actions";
import { useNavigation } from "@react-navigation/native";
import type { SwitchAccountNavigationProp, WalletNavigationProp } from "../types/navigation";

export default () => {
    const currentAddress = useCurrentAddress();

    return (
        <Wrapper type="full">
            <WalletList renderItem={(address: string) => {
                return <ListItem address={address} selected={currentAddress.get() === address} />
            }} />
            <Footer/>
        </Wrapper>
    )
}

const Footer = () => {
    const navigation = useNavigation<WalletNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const { Spacing } = theme.vars;
    const i18n = useI18n();
  
    return (
      <View style={{alignItems: 'center', padding: Spacing.base}}>
        <Pressable onPress={() => navigation.navigate('NewWalletAccount')}>
          <Text style={styles.link}>{i18n.t('add_account')}</Text>
        </Pressable>
      </View>
    );
};

const ListItem = (props: {
    address: string,
    selected: boolean
}) => {
    const navigation = useNavigation<SwitchAccountNavigationProp>();
    const wallet = useWallet(props.address).get();
    const theme = useTheme();
    const { Spacing } = theme.vars;

    const ItemComponent = () => (
        <View style={{ flex: 1, flexDirection: 'row', columnGap: Spacing.base, alignItems: 'center' }}>
            <WalletAvatar size={36} address={wallet.address} name={wallet.name} />
            <Text>{wallet.name}</Text>
        </View>
    );

    return (
        <ListItemSelected
            ItemComponent={ItemComponent}
            selected={props.selected}
            onPress={() => {
                setCurrentWallet(props.address);
                navigation.goBack();
            }}
        />
    )
}