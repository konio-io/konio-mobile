import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { addCoin, logError, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text, CoinLogo } from '../components';
import { useCoins, useCurrentNetworkId, useI18n } from '../hooks';
import { ScrollView, View } from 'react-native';
import { UserStore } from '../stores';
import { useTheme, useCurrentAddress } from '../hooks';
import { DEFAULT_COINS, TOKENS_URL } from '../lib/Constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getCoinBalance } from '../lib/utils';
import { useEffect } from 'react';

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
        logError(e);
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
          multiline={true}
          autoFocus={true}
          value={contractId.get()}
          onChangeText={(v: string) => contractId.set(v.trim())}
          placeholder={i18n.t('contract_address')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.paddingBase}>
        <SuggestList onPressCoin={(cId: string) => contractId.set(cId)} />
        <RecentList onPressCoin={(cId: string) => contractId.set(cId)} />
      </ScrollView>

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

const SuggestList = (props: {
  onPressCoin: Function
}) => {
  type Item = {
    contractId: string,
    symbol: string
  }

  type Token = {
    address: string,
    symbol: string,
    chainId: string
  }

  const currentNetworkId = useCurrentNetworkId().get();
  const currentAddress = useCurrentAddress().get();
  const currentCoins = useCoins().get();
  const coinList = useHookstate<Array<Item>>([]);
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;

  if (!currentAddress) {
    return <View></View>
  }

  const refreshList = async () => {
    try {
      const tokenListResponse = await fetch(`${TOKENS_URL}/index.json`);
      console.log(await tokenListResponse.text());
      const tokenMap: Array<Token> = await tokenListResponse.json();
      const tokenList = Object.values(tokenMap).filter(token => {
        return token.chainId === currentNetworkId
          && !currentCoins.includes(token.address)
          && token.symbol !== "MANA";
      });

      for (const token of tokenList) {
        getCoinBalance({
          address: currentAddress,
          networkId: currentNetworkId,
          contractId: token.address
        })
          .then(value => {
            if (value !== '0') {
              coinList.merge([{
                contractId: token.address,
                symbol: token.symbol
              }])
            }
          })
          .catch(e => {
            throw(e);
          });
      }

    } catch (e) {
      logError(e);
    }
  }

  useEffect(() => {
    refreshList();
  }, [currentNetworkId, currentAddress]);

  if (coinList.get().length === 0) {
    return <></>
  }

  const data = coinList.get().slice(0, 5);

  return (
    <View>
      <Text style={styles.sectionTitle}>{i18n.t('auto_discovered')}</Text>

      <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
        {data.map(coin =>
          <ListItem key={coin.contractId} contractId={coin.contractId} symbol={coin.symbol} onPress={(cId: string) => props.onPressCoin(cId)} />
        )}
      </View>
    </View>
  );
}

const RecentList = (props: {
  onPressCoin: Function
}) => {
  const currentNetworkId = useCurrentNetworkId()
  const coins = useHookstate(UserStore.coins);
  const theme = useTheme();
  const styles = theme.styles;
  const i18n = useI18n();

  const data = Object.values(coins.get())
    .filter(coin => coin.networkId === currentNetworkId.get() && !DEFAULT_COINS.includes(coin.symbol))
    .slice(0, 5);

  if (data.length === 0) {
    return <></>
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>{i18n.t('recents')}</Text>

      <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
        {data.map(coin =>
          <ListItem key={coin.contractId} contractId={coin.contractId} symbol={coin.symbol} onPress={(cId: string) => props.onPressCoin(cId)} />
        )}
      </View>
    </View>
  );
}

const ListItem = (props: {
  contractId: string,
  symbol: string,
  onPress: Function
}) => {

  const theme = useTheme();
  const styles = theme.styles;

  return (
    <TouchableOpacity onPress={() => props.onPress(props.contractId)}>
      <View style={{ ...styles.rowGapSmall, ...styles.paddingSmall, ...styles.alignCenterColumn }}>
        <CoinLogo contractId={props.contractId} size={44} />
        <Text>{props.symbol}</Text>
      </View>
    </TouchableOpacity>
  );
}