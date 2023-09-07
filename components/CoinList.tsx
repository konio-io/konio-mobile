import { FlatList, RefreshControl } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { useCoins } from '../hooks';
import { refreshCoins } from '../actions';

export default (props: {
    renderItem: Function
}) => {
    const refreshing = useHookstate(false);
    const coins = useCoins();

    if (!coins.ornull) {
        return <></>;
    }

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
        />
    );
}