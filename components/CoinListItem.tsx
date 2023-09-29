import { useTheme } from '../hooks';
import { View, StyleSheet } from 'react-native';
import CoinLogo from './CoinLogo';
import type { Theme } from '../types/ui';
import Text from './Text';
import { useEffect, useState } from 'react';
import { useHookstate } from '@hookstate/core';
import CoinStore from '../stores/CoinStore';
import { Coin } from '../types/store';
import SelectedTicker from './SelectedTicker';

export default (props: {
    coin: Coin
    selected?: boolean
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [selected, setSelected] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <CoinLogo coinId={props.coin.id} size={48} />

                <View>
                    <Text style={styles.symbol}>{props.coin.symbol}</Text>
                    <Text>{props.coin.name}</Text>
                </View>

            </View>

            {
                selected !== undefined &&
                <View>
                    <SelectedTicker selected={selected}/>
                </View>
            }
            {
                selected === undefined &&
                <View>
                    <Balance coinId={props.coin.id} />
                </View>
            }

        </View>
    );
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
                    <Text style={{ ...styles.text, ...styles.textRight }}>{balance.toFixed(2)}</Text>

                    {price !== undefined &&
                        <Text style={{ ...styles.text, ...styles.textRight }}>
                            {(balance * price).toFixed(2)} USD
                        </Text>
                    }

                    
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