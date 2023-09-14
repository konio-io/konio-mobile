import { FlatList, RefreshControl, TouchableHighlight, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCoins, useTheme } from '../hooks';
import { CoinListItem, ButtonCircle } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { Feather } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { refreshCoins } from '../actions';

export default () => {
  const refreshing = useHookstate(false);
  const coins = useCoins();

  const loadCoinList = async () => {
      refreshing.set(true);
      await refreshCoins({balance: true, price: true, info: true});
      refreshing.set(false);
  };

  return (
      <FlatList
          data={Object.keys(coins.get())}
          renderItem={({ item }) => <TouchableCoinListItem contractId={item} />}
          refreshControl={
              <RefreshControl refreshing={refreshing.get()} onRefresh={loadCoinList} />
          }
          ListFooterComponent={<Footer />}
      />
  );
}

const TouchableCoinListItem = (props: {
  contractId: string,
}) => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Coin', { contractId: props.contractId })}
      onLongPress={() => {
        SheetManager.show('coin', { payload: { contractId: props.contractId } });
      }}
    >
      <View style={styles.listItemContainer}>
        <CoinListItem contractId={props.contractId} />
      </View>
    </TouchableHighlight>
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