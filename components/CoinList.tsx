import { FlatList, RefreshControl } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { useCoins } from '../hooks';
import { refreshCoins } from '../actions';
import { ReactElement } from 'react';

export default (props: {
    renderItem: Function
    footerComponent?: ReactElement
}) => {
    const refreshing = useHookstate(false);
    const coins = useCoins();

    const loadCoinList = async () => {
        refreshing.set(true);
        await refreshCoins({balance: true, price: true});
        refreshing.set(false);
    };

    return (
        <FlatList
            data={Object.keys(coins.get())}
            renderItem={({ item }) => props.renderItem(item)}
            refreshControl={
                <RefreshControl refreshing={refreshing.get()} onRefresh={loadCoinList} />
            }
            ListFooterComponent={props.footerComponent ?? <></>}
        />
    );
}