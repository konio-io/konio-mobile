import { FlatList, RefreshControl } from 'react-native';
import { JSXElementConstructor, useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { useCoins, useCurrentNetworkId } from '../hooks';
import { refreshCoinListBalance, refreshMana } from '../actions';
import { UserStore } from '../stores';
import ActivityIndicator from './ActivityIndicator';

export default (props: {
    renderItem: Function,
    FooterComponent?: JSXElementConstructor<any>
}) => {
    const refreshing = useHookstate(false);

    const currentNetworkId = useCurrentNetworkId();
    const walletCoins = useCoins();
    const coins = walletCoins.get()
        .filter((contractId: string) => {
            const coin = UserStore.coins[contractId];
            return coin.networkId.get() === currentNetworkId.get();
        });

    const loadCoinList = () => {
        refreshing.set(true);
        refreshing.set(false);
    };

    useEffect(() => {
        refreshMana();
        refreshCoinListBalance();
    }, [refreshing]); //ToDo: move this autoside?

    if (refreshing.get()) {
        return <ActivityIndicator />;
    }

    return (
        <FlatList
            data={coins}
            renderItem={({ item }) => props.renderItem(item)}
            ListFooterComponent={props.FooterComponent}
            refreshControl={
                <RefreshControl refreshing={refreshing.get()} onRefresh={loadCoinList} />
            }
        />
    );
}