import { useCoin, useTheme } from '../hooks';
import { View, StyleSheet } from 'react-native';
import CoinLogo from './CoinLogo';
import type { Theme } from '../types/store';
import Text from './Text';
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { useEffect } from 'react';

export default (props: {
    contractId: string
    selected?: boolean
}) => {

    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color } = theme.vars;
    const coin = useCoin(props.contractId);
    const selected = useHookstate<boolean|undefined>(undefined);
    useEffect(() => {
        selected.set(props.selected);
    }, [props.selected])

    if (!coin) {
        return <></>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <CoinLogo contractId={props.contractId} size={48} />

                <View>
                    <Text style={styles.symbol}>{coin.symbol}</Text>
                    <Text>{coin.name}</Text>
                </View>
            </View>

            {
                selected.ornull &&
                <View>
                    {
                        selected.get() === true && <Feather name="check-circle" size={20} color={Color.primary}/>
                    }
                    {
                        selected.get() === false && <Feather name="circle" size={20} color={Color.primary}/>
                    }
                </View>
            }
            {
                !selected.ornull &&
                <View>
                    {coin.balance !== undefined && coin.balance >= 0 &&
                        <View>
                            {coin.price !== undefined &&
                                <Text style={{ ...styles.text, ...styles.textRight }}>
                                    {(coin.balance * coin.price).toFixed(2)} USD
                                </Text>
                            }

                            <Text style={{ ...styles.text, ...styles.textRight }}>{coin.balance.toFixed(2)}</Text>
                        </View>
                    }
                </View>
            }

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