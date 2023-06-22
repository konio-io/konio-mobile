import { View, FlatList } from 'react-native';
import { useWallets, useTheme } from '../hooks';

type FilterFunction = (param: string) => boolean;

export default (props: {
    renderItem: Function,
    filter?: FilterFunction
}) => {

    const wallets = useWallets();
    const theme = useTheme();
    const styles = theme.styles;
    let data = wallets.get().map(w => w.address);

    if (typeof props.filter === 'function') {
        data = data.filter(props.filter);
    }

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => props.renderItem(item) }
            ItemSeparatorComponent={() => <View style={styles.separator}/>}
        />
    );
}
