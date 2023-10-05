import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text, ActivityIndicator } from '../components';
import { useCoins, useCurrentNetwork, useI18n } from '../hooks';
import { Keyboard, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../hooks';
import { TOKENS_URL } from '../lib/Constants';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { SpinnerStore, CoinStore, LogStore, SettingStore } from '../stores';

export default () => {
  const navigation = useNavigation<NewCoinNavigationProp>();
  const [contractId, setContractId] = useState('');
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;

  const add = () => {
    Keyboard.dismiss();

    if (!contractId) {
      Toast.show({
        type: 'error',
        text1: i18n.t('missing_contract_address')
      });
      return;
    }

    SpinnerStore.actions.showSpinner();

    CoinStore.actions.addCoin(contractId)
      .then(coin => {
        SpinnerStore.actions.hideSpinner();
        navigation.goBack();
        SettingStore.actions.showAskReview();
      })
      .catch(e => {
        SpinnerStore.actions.hideSpinner();
        LogStore.actions.logError(e);
        Toast.show({
          type: 'error',
          text1: i18n.t('unable_to_add_coin'),
          text2: i18n.t('check_contract')
        });
      });
  };

  return (
    <Screen keyboardDismiss={true}>
      <View style={{ ...styles.paddingBase }}>
        <TextInput
          multiline={true}
          autoFocus={true}
          value={contractId}
          onChangeText={(v: string) => setContractId(v.trim())}
          placeholder={i18n.t('contract_address')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.paddingBase}>
        <SuggestList onPressCoin={(cId: string) => setContractId(cId)} />
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

  const currentNetwork = useCurrentNetwork();
  const currentCoins = useCoins();
  const [coinList, setCoinList] = useState<Array<Item>>([]);
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;
  const [searching, setSearching] = useState(false);

  const refreshList = async () => {
    setSearching(true);
    try {
      const tokenListResponse = await fetch(`${TOKENS_URL}/index.json`);
      const tokenMap: Array<Token> = await tokenListResponse.json();
      const tokenList = Object.values(tokenMap).filter(token => {
        return token.chainId === currentNetwork.chainId
          && !currentCoins.map(c => c.contractId).includes(token.address)
          && token.symbol !== "MANA";
      });

      for (const token of tokenList) {
        const value = await CoinStore.getters.fetchCoinBalance(token.address);
        
        if (value && value > 0) {
          setCoinList(current => [
            ...current,
            {
              contractId: token.address,
              symbol: token.symbol,
              ...coinList
            }
          ])
        }
      }
    } catch (e) {
      LogStore.actions.logError(String(e));
    }
    setSearching(false);
  }

  const data = coinList.slice(0, 5);

  useEffect(() => {
    refreshList();
  },[]);

  return (
    <View>
        <View>
          <Text style={styles.sectionTitle}>{i18n.t('auto_discovered')}</Text>

          <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
            {data.map(coin =>
              <ListItem key={coin.contractId} contractId={coin.contractId} symbol={coin.symbol} onPress={(cId: string) => props.onPressCoin(cId)} />
            )}
            {searching === true &&
              <View style={{...styles.alignCenterRow, height: 65, width: 40 }}>
                <ActivityIndicator></ActivityIndicator>
              </View>
            }
          </View>
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

const CoinLogo = (props: {
  contractId: string,
  size: number
}) => {
  const [logo, setlogo] = useState('',);
  const theme = useTheme();
  const { Border } = theme.vars;

  useEffect(() => {
          CoinStore.getters.fetchContractInfo(props.contractId).then(info => {
              if (info.logo) {
                  setlogo(info.logo);
              }
          });
  }, []);

  return (
      <View style={{borderRadius: props.size, borderColor: Border.color, borderWidth: Border.width, padding: 1}}>
          {logo &&
              <Image style={{ width: props.size, height: props.size, borderRadius: props.size }} source={{ uri: logo }} />
          }
      </View>
  );
};