import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { useWallet, useTheme } from '../hooks';
import type { Theme } from '../types/store';
import Address from './Address';
import WalletAvatar from './WalletAvatar';
import Text from './Text';

export default (props: {
    address: string,
    onPress: Function
}) => {

    const wallet = useWallet(props.address).get();
    const theme = useTheme().get();
    const styles = createStyles(theme);

    return (
        <TouchableHighlight onPress={() => props.onPress(wallet)}>
            <View style={styles.walletListItemContainer}>
                <WalletAvatar size={36} address={wallet.address} name={wallet.name} />
                <View style={{flex: 1}}>
                    <Text style={styles.walletListItemText}>{wallet.name}</Text>
                    <Address address={wallet.address}/>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme: Theme) => {
    const  { Color, Spacing, FontFamily, FontSize } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        walletListItemContainer: {
            flex: 1,
            flexDirection: 'row',
            columnGap: Spacing.base,
            alignItems: 'center',
            padding: Spacing.base,
            backgroundColor: Color.base
        },
        walletListItemText: {
            color: Color.baseContrast,
            fontFamily: FontFamily.sans,
            fontSize: FontSize.medium
        }
    });
}

