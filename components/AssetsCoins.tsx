import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {  useCoins, useTheme } from '../hooks';
import { CoinListItem, ButtonCircle, Button } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { Feather } from '@expo/vector-icons';
import { refreshCoins } from '../actions';
import { useState } from 'react';
import { Coin } from '../types/store';
import { UserStore } from '../stores';

export default () => {
  const [refreshing, setRefreshing] = useState(false)
  const coins = useCoins();

  const _loadCoinList = async () => {
      setRefreshing(true);
      await refreshCoins({balance: true, price: true, info: true});
      setRefreshing(false);
  };

  console.log('--- render assets coins')

  const cc = () => {
    const address = UserStore.currentAddress.get();
    const networkId = UserStore.currentNetworkId.get();
    const contractId = "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL";
    const b = UserStore.accounts[address].assets[networkId].coins[contractId].balance.get() ?? 1;
    UserStore.accounts[address].assets[networkId].coins[contractId].balance.set(b * 2);
  }

  return (
    <View>
      <Button title='Test' onPress={() => cc()}/>
      <FlatList
          data={coins}
          renderItem={({ item }) => <TouchableCoinListItem coin={item} />}
          refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={_loadCoinList} />
          }
          ListFooterComponent={<Footer />}
      />
    </View>
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