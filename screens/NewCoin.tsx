import { ImmutableObject, useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { addCoin, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text, CoinLogo } from '../components';
import { useCurrentNetworkId, useI18n } from '../hooks';
import { View } from 'react-native';
import { UserStore } from '../stores';
import { useTheme } from '../hooks';
import { Coin } from '../types/store';
import { DEFAULT_COINS } from '../lib/Constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default () => {
  const navigation = useNavigation<NewCoinNavigationProp>();
  const contractId = useHookstate('');
  const i18n = useI18n();
  const theme = useTheme();
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
        navigation.goBack();
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
      <View style={{ ...styles.paddingBase }}>
        <TextInput
          style={{ fontSize: 12 }}
          autoFocus={true}
          value={contractId.get()}
          onChangeText={(v: string) => contractId.set(v.trim())}
          placeholder={i18n.t('contract_address')}
        />
      </View>

      <View style={styles.paddingBase}>
        <Text style={styles.sectionTitle}>{i18n.t('recents')}</Text>
      </View>

      <View style={{ ...styles.flex1, ...styles.paddingBase }}>
        <RecentList onPressCoin={(cId: string) => contractId.set(cId)} />
      </View>

      <View style={styles.paddingBase}>
        <Button
          title={i18n.t('add_coin')}
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
  const theme = useTheme();
  const styles = theme.styles;

  const data = Object.values(coins.get())
    .filter(coin => coin.networkId === currentNetworkId.get() && !DEFAULT_COINS.includes(coin.symbol))
    .slice(0, 5);

  return (
    <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
      {data.map(coin =>
        <RecentListItem key={coin.contractId} coin={coin} onPress={(cId: string) => props.onPressCoin(cId)} />
      )}
    </View>
  )
}

const RecentListItem = (props: {
  coin: ImmutableObject<Coin>,
  onPress: Function
}) => {

  const theme = useTheme();
  const styles = theme.styles;
  const { Color } = theme.vars;

  return (
    <TouchableOpacity onPress={() => props.onPress(props.coin.contractId)}>
      <View style={{ ...styles.rowGapSmall, ...styles.paddingSmall }}>
        <CoinLogo contractId={props.coin.contractId} size={36} />
        <Text>{props.coin.symbol}</Text>
      </View>
    </TouchableOpacity>
  );
}