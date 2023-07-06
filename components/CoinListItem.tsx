import { useTheme } from '../hooks';
import CoinBalance from './CoinBalance';
import { View, StyleSheet } from 'react-native';
import CoinSymbol from './CoinSymbol';
import CoinValue from './CoinValue';
import CoinLogo from './CoinLogo';
import type { Theme } from '../types/store';

export default (props: {
    contractId: string
}) => {

    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <CoinLogo contractId={props.contractId} size={48} />

                <View>
                    <CoinSymbol contractId={props.contractId} />
                    <CoinBalance contractId={props.contractId} />
                </View>
            </View>

            <CoinValue contractId={props.contractId} />
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, FontFamily, Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        letter: {
            fontFamily: FontFamily.sans,
            color: Color.base
        },
        container: {
            flex: 1, 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center'
        },
        leftContainer: {
            flexDirection: 'row',
             columnGap: Spacing.base, 
             alignItems: 'center'
        }
    });
}