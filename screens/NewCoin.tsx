import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { addCoin, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text, CoinSymbol, Separator } from '../components';
import { useCurrentNetworkId, useI18n } from '../hooks';
import { FlatList, TouchableHighlight, View } from 'react-native';
import { UserStore } from '../stores';
import { useCurrentKoin, useTheme } from '../hooks';

export default () => {
  const navigation = useNavigation<NewCoinNavigationProp>();
  const contractId = useHookstate('');
  const i18n = useI18n();
  const theme = useTheme();
  const { Spacing } = theme.vars;
  const styles = theme.styles;

  const add = () => {
    if (!contractId.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_contract_address')
      });
      return;
    }

    addCoin(contractId.get())
      .then(coin => {

        showToast({
          type: 'success',
          text1: i18n.t('added', { name: coin.symbol }),
        });
        navigation.navigate('Account');

      })
      .catch(e => {
        showToast({
          type: 'error',
          text1: i18n.t('unable_to_add_coin'),
          text2: i18n.t('check_contract')
        });
      });
  };

  return (
    <Screen>
      <View style={{ padding: Spacing.base, rowGap: Spacing.small }}>
        <TextInput
          autoFocus={true}
          value={contractId.get()}
          onChangeText={(v: string) => contractId.set(v.trim())}
          placeholder={i18n.t('contract_address')}
        />
      </View>

      <View style={{ padding: Spacing.base }}>
        <Text style={styles.textSmall}>{i18n.t('recents')}</Text>
      </View>

      <RecentList onPressCoin={(cId: string) => contractId.set(cId)} />

      <View style={{ padding: Spacing.base }}>
        <Button
          title="Add coin"
          onPress={() => add()}
          icon={<Feather name="plus" />}
        />
      </View>
    </Screen>
  );
}

const RecentList = (props: {
  onPressCoin: Function
}) => {
  const currentNetworkId = useCurrentNetworkId()
  const coins = useHookstate(UserStore.coins);
  const currentKoin = useCurrentKoin();

  const data = Object.values(coins.get())
    .filter(coin => coin.networkId === currentNetworkId.get() && coin.contractId !== currentKoin.get())
    .slice(0, 5);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <RecentListItem contractId={item.contractId} onPress={(cId: string) => props.onPressCoin(cId)} />}
      ItemSeparatorComponent={() => <Separator />}
    />
  )
}

const RecentListItem = (props: {
  contractId: string,
  onPress: Function
}) => {

  const theme = useTheme();
  const styles = theme.styles;

  return (
    <TouchableHighlight onPress={() => props.onPress(props.contractId)}>
      <View style={styles.listItemContainer}>

        <CoinSymbol contractId={props.contractId} />

      </View>
    </TouchableHighlight>
  );
}