import { useCoin, useTheme } from '../hooks';
import { View, StyleSheet } from 'react-native';
import CoinLogo from './CoinLogo';
import type { Theme } from '../types/store';
import Text from './Text';

export default (props: {
    contractId: string
}) => {

    const theme = useTheme();
    const styles = createStyles(theme);
    const coin = useCoin(props.contractId);

    if (!coin.ornull) {
        return <></>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <CoinLogo contractId={props.contractId} size={48} />

                <View>
                    <Text style={styles.symbol}>{coin.symbol.get()}</Text>
                    <Text>{coin.name.get()}</Text>
                </View>
            </View>

            <View>
                {coin.balance.ornull && coin.balance.ornull.get() >= 0 &&
                    <View>
                        {coin.price.ornull && 
                            <Text style={{...styles.text,...styles.textRight}}>
                                {(coin.balance.ornull.get() * coin.price.ornull.get()).toFixed(2)} USD
                            </Text>
                        }

                        <Text style={{...styles.text, ...styles.textRight}}>{coin.balance.ornull.get()}</Text>
                    </View>
                }
            </View>
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