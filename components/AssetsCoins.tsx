import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {  useCoins, useTheme } from '../hooks';
import { CoinListItem, ButtonCircle } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { Feather } from '@expo/vector-icons';
import { refreshCoins } from '../actions';
import { useState } from 'react';
import { Coin } from '../types/store';

export default () => {
  const [refreshing, setRefreshing] = useState(false)
  const coins = useCoins();

  const _loadCoinList = async () => {
      setRefreshing(true);
      await refreshCoins({balance: true, price: true, info: true});
      setRefreshing(false);
  };

  return (
      <FlatList
          data={coins}
          renderItem={({ item }) => <TouchableCoinListItem coin={item} />}
          refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={_loadCoinList} />
          }
          ListFooterComponent={<Footer />}
      />
  );
}

const TouchableCoinListItem = (props: {
  coin: Coin,
}) => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Coin', { contractId: props.coin.contractId })}
      onLongPress={() => {
        SheetManager.show('coin', { payload: { contractId: props.coin.contractId } });
      }}
    >
      <View style={styles.listItemContainer}>
        <CoinListItem contractId={props.coin.contractId} />
      </View>
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