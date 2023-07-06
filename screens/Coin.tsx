import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoinRouteProp, AssetsNavigationProp } from '../types/navigation';
import type { Theme } from '../types/store';
import { Button, TransactionList, Address, Screen, MoreVertical } from '../components';
import { useCoin, useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";
import { DEFAULT_COINS } from '../lib/Constants';

export default () => {
    const navigation = useNavigation<AssetsNavigationProp>();
    const route = useRoute<CoinRouteProp>();
    const walletCoin = useCoin(route.params.contractId);
    const coin = walletCoin.get();
    const theme = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            title: walletCoin.symbol.get(),
            headerRight: () => {
                if (!DEFAULT_COINS.includes(coin.symbol)) {
                    return (
                        <MoreVertical onPress={() => {
                            SheetManager.show('coin', { payload: { contractId: route.params.contractId } });
                        }} />
                    )
                }
            }
        });
    }, [walletCoin, navigation]);

    return (
        <Screen>
            <View style={styles.header}>

                <View style={styles.headerContent}>
                    <View style={styles.titleContent}>
                        <Address address={coin.contractId} copiable={true} compress={true} />
                    </View>

                    {walletCoin.symbol.get() !== 'VHP' &&
                        <View style={styles.buttonsContainer}>
                            <Button
                                style={{ flex: 1 }}
                                title="Send"
                                onPress={() => {
                                    navigation.navigate('Withdraw', {
                                        screen: 'WithdrawTo',
                                        params: {
                                            contractId: route.params.contractId
                                        }
                                    });
                                }}
                                icon={<Feather name="arrow-up-right" />}
                            />
                            <Button
                                style={{ flex: 1 }}
                                title="Receive"
                                onPress={() => navigation.navigate('Deposit')}
                                icon={<Feather name="arrow-down-right" />}
                                type='secondary'
                            />
                        </View>
                    }
                </View>

            </View>

            <TransactionList contractId={route.params.contractId} />

        </Screen>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, Border, Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        wrapper: {
            flex: 1,
            backgroundColor: Color.base
        },
        header: {
            height: 170,
            borderBottomWidth: Border.width,
            borderBottomColor: Border.color,
            backgroundColor: Color.base,
            alignItems: 'center',
            justifyContent: 'center',

        },
        headerContent: {
            width: 300,
            rowGap: Spacing.base
        },
        titleContent: {
            alignItems: 'center'
        },
        buttonsContainer: {
            height: 40,
            flexDirection: 'row',
            columnGap: Spacing.base
        }
    });
}