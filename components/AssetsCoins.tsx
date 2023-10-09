import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CoinListItem, ButtonCircle } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Coin } from '../types/store';
import { useCoins, useTheme } from '../hooks';
import CoinStore from '../stores/CoinStore';

export default () => {
  const [refreshing, setRefreshing] = useState(false);
  const coins = useCoins();

  const _refresh = async () => {
      setRefreshing(true);
      await CoinStore.actions.refreshCoins({balance: true, price: true, info: true});
      setRefreshing(false);
  };

  return (
      <FlatList
          data={coins}
          renderItem={({ item }) => <TouchableCoinListItem coin={item} />}
          refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={_refresh} />
          }
          ListFooterComponent={<Footer />}
      />
  );
}

const TouchableCoinListItem = (props: {
  coin: Coin,
}) => {
  const navigation = useNavigation<AssetsNavigationProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Coin', { coinId: props.coin.id })}
      onLongPress={() => {
        SheetManager.show('coin', { payload: { coinId: props.coin.id } });
      }}
    >
      <CoinListItem coin={props.coin} />
    </TouchableOpacity>
  );
}

const Footer = () => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <View style={{ ...styles.alignCenterColumn, ...styles.paddingSmall }}>
      <ButtonCircle
        onPress={() => navigation.navigate('NewCoin')}
        icon={(<Feather name="plus" />)}
        type='secondary'
      />
    </View>
  );
};