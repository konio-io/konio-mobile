import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import CoinBalance from './CoinBalance';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import CoinSymbol from './CoinSymbol';

export default (props: {
    contractId: string,
    onPress?: Function
}) => {
    
    const theme = useTheme().get();
    const styles = createStyles(theme);

    return (
        <TouchableHighlight onPress={() => {
            if (props.onPress) {
                props.onPress();
            }
        }}>
            <View style={styles.coinListItemContainer}>
                <CoinSymbol contractId={props.contractId} />
                <CoinBalance contractId={props.contractId} />
            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Color, FontFamily, FontSize } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        coinListItemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: Spacing.base,
            backgroundColor: Color.base
        }
    });
}