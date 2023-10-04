import { FlatList, Linking, RefreshControl, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoinRouteProp, HoldingsNavigationProp } from '../types/navigation';
import { Button, Screen, MoreVertical, Text, CoinLogo, TransactionListItem, ButtonCircle } from '../components';
import { useCurrentAccount, useCurrentNetwork, useI18n, useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { SheetManager } from "react-native-actions-sheet";
import Loading from './Loading';
import { useHookstate } from '@hookstate/core';
import { CoinStore, SpinnerStore, TransactionStore } from '../stores';
import { Coin } from '../types/store';

export default () => {
    const navigation = useNavigation<HoldingsNavigationProp>();
    const route = useRoute<CoinRouteProp>();
    const coin = useHookstate(CoinStore.state.nested(route.params.coinId)).get();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    useEffect(() => {
        if (coin) {
            navigation.setOptions({
                title: coin.symbol,
                headerRight: () => {
                    return (
                        <MoreVertical onPress={() => {
                            SheetManager.show('coin', { payload: { coinId: route.params.coinId } });
                        }} />
                    )
                }
            });
        }
    }, [coin, navigation]);

    if (!coin) {
        return <Loading />
    }

    return (
        <Screen>
            <View style={{ ...styles.paddingBase, ...styles.rowGapLarge }}>

                <View style={{ ...styles.alignCenterColumn, ...styles.rowGapSmall }}>
                    <CoinLogo size={80} coinId={route.params.coinId} />
                    {
                        coin.balance !== undefined && coin.balance >= 0 &&
                        <View>
                            <Text style={{ ...styles.textLarge, ...styles.textCenter }}>
                                {coin.balance} {coin.symbol}
                            </Text>

                            {coin.price !== undefined &&
                                <Text style={{ ...styles.text, ...styles.textCenter }}>
                                    {(coin.balance * coin.price).toFixed(2)} USD
                                </Text>
                            }
                        </View>
                    }
                </View>

                {coin.symbol !== 'VHP' &&
                    <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                        <Button
                            style={{ flex: 1 }}
                            title={i18n.t('send')}
                            onPress={() => {
                                navigation.navigate('Withdraw', {
                                    coinId: route.params.coinId
                                });
                            }}
                            icon={<Feather name="arrow-up-right" />}
                        />
                        <Button
                            style={{ flex: 1 }}
                            title={i18n.t('receive')}
                            onPress={() => navigation.navigate('Deposit')}
                            icon={<Feather name="arrow-down-right" />}
                            type='secondary'
                        />
                    </View>
                }
            </View>

            <View style={{ ...styles.paddingBase, flex: 1 }}>
                <Text style={styles.sectionTitle}>{i18n.t('transactions')}</Text>
                <TransactionList coin={coin} />
            </View>

        </Screen>
    );
}

const TransactionList = (props: {
    coin: Coin
}) => {
    const { styles } = useTheme();

    const [refreshing, setRefreshing] = useState(false)
    const currentAccount = useCurrentAccount();
    const currentNetwork = useCurrentNetwork();

    const transactions = useHookstate(TransactionStore.state).get();
    const data = Object.values(transactions)
        .filter(transaction =>
            transaction.contractId === props.coin.contractId &&
            (transaction.from === currentAccount.address || transaction.to === currentAccount.address) &&
            transaction.networkId === currentNetwork.id
        ).sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
    ;

    useEffect(() => {
        if (data.length === 0) {
            SpinnerStore.actions.showSpinner();
            TransactionStore.actions.refreshTransactions(props.coin.id)
                .then(() => SpinnerStore.actions.hideSpinner())
                .catch(e => SpinnerStore.actions.hideSpinner());
        }
    }, [data]);

    const _refresh = async () => {
        setRefreshing(true);
        await TransactionStore.actions.refreshTransactions(props.coin.id);
        setRefreshing(false);
    };

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => <TransactionListItem transaction={item} coin={props.coin} />}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={_refresh} />
            }
            ListFooterComponent={(
                <View style={{ ...styles.alignCenterColumn, ...styles.paddingBase }}>
                    <ButtonCircle
                        onPress={() => Linking.openURL(`https://koiner.app/mobile/addresses/${currentAccount.address}/history`)}
                        icon={(<Feather name="more-horizontal" />)}
                        type='secondary'
                    />
                </View>
            )}
        />
    )
}