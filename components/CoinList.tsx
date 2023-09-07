import { FlatList, RefreshControl } from 'react-native';
import { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { useCoins, useCurrentNetworkId } from '../hooks';
import { refreshCoinListBalance, refreshMana } from '../actions';
import { UserStore } from '../stores';
import ActivityIndicator from './ActivityIndicator';

export default (props: {
    renderItem: Function
}) => {
    const refreshing = useHookstate(false);
    const currentNetworkId = useCurrentNetworkId();
    const accountCoins = useCoins();
    const coins = accountCoins.get()
        .filter((contractId: string) => {
            const coin = UserStore.coins[contractId];
            if (coin) {
                return coin.networkId.get() === currentNetworkId.get();
            }
            return false;
        });

    const loadCoinList = async () => {
        refreshing.set(true);
        await refreshMana();
        await refreshCoinListBalance();
        refreshing.set(false);
    };

    if (refreshing.get() === true) {
        return <ActivityIndicator />;
    }

    return (
        <FlatList
            data={coins}
            renderItem={({ item }) => props.renderItem(item)}
            refreshControl={
                <RefreshControl refreshing={refreshing.get()} onRefresh={loadCoinList} />
            }
        />
    );
}