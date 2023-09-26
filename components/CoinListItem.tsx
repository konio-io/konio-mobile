import { useTheme } from '../hooks';
import { View, StyleSheet } from 'react-native';
import CoinLogo from './CoinLogo';
import type { Theme } from '../types/ui';
import Text from './Text';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useHookstate } from '@hookstate/core';
import CoinStore from '../stores/CoinStore';

export default (props: {
    coinId: string
    selected?: boolean
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color } = theme.vars;

    const [selected, setSelected] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <CoinLogo coinId={props.coinId} size={48} />

                <View>
                    <SymbolName coinId={props.coinId}/>
                </View>

            </View>

            {
                selected !== undefined &&
                <View>
                    {
                        selected === true && <Feather name="check-circle" size={20} color={Color.primary} />
                    }
                    {
                        selected === false && <Feather name="circle" size={20} color={Color.primary} />
                    }
                </View>
            }
            {
                selected === undefined &&
                <View>
                    <Balance coinId={props.coinId} />
                </View>
            }

        </View>
    );
}

const SymbolName = (props: {
    coinId: string
}) => {
    const name = useHookstate(CoinStore.state.nested(props.coinId).name).get();
    const symbol = useHookstate(CoinStore.state.nested(props.coinId).symbol).get();
    const { styles } = useTheme();

    return (
        <View>
            <Text style={styles.symbol}>{symbol}</Text>
            <Text>{name}</Text>
        </View>
    )
}

const Balance = (props: {
    coinId: string
}) => {
    const balance = useHookstate(CoinStore.state.nested(props.coinId).balance).get();
    const price = useHookstate(CoinStore.state.nested(props.coinId).price).get();
    const { styles } = useTheme();
    
    return (
        <View>
            {balance !== undefined && balance >= 0 &&
                <View>
                    {price !== undefined &&
                        <Text style={{ ...styles.text, ...styles.textRight }}>
                            {(balance * price).toFixed(2)} USD
                        </Text>
                    }

                    <Text style={{ ...styles.text, ...styles.textRight }}>{balance.toFixed(2)}</Text>
                </View>
            }
        </View>
    )
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