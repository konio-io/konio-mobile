import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text, TextInputActionPaste } from '../components';
import { useCoins, useCurrentNetwork, useI18n } from '../hooks';
import { Keyboard, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { useTheme } from '../hooks';
import { TOKENS_URL } from '../lib/Constants';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { SpinnerStore, CoinStore, LogStore, SettingStore } from '../stores';

type Coin = {
  address: string,
  symbol: string,
  chainId: string,
  name: string,
  logo: string
}

export default () => {
  const navigation = useNavigation<NewCoinNavigationProp>();
  const [contractId, setContractId] = useState('');
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;
  const currentNetwork = useCurrentNetwork();
  const [data, setData] = useState<Array<Coin>>([]);
  const coins = useCoins();

  const loadData = async () => {
    try {
      SpinnerStore.actions.showSpinner();
      const tokenListResponse = await fetch(`${TOKENS_URL}/index.json`);
      const tokenMap: Array<Coin> = await tokenListResponse.json();
      const tokenList = Object.values(tokenMap)
        .filter(token => {
          return token.chainId === currentNetwork.chainId
            && token.symbol !== "MANA"
            && !coins.map(coin => coin.contractId).includes(token.address)
        })
        .sort((a, b) => a.name > b.name ? 1 : -1);
  
      setData(tokenList);
      SpinnerStore.actions.hideSpinner();
    } catch (e) {
      SpinnerStore.actions.hideSpinner();
    }
  }

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

  useEffect(() => {
    loadData()
  }, []);

  return (
    <Screen keyboardDismiss={true}>
      <View style={{ ...styles.paddingBase }}>
        <TextInput
          multiline={true}
          value={contractId}
          onChangeText={(v: string) => setContractId(v.trim())}
          placeholder={i18n.t('contract_address')}
          actions={(
            <TextInputActionPaste onPaste={(v: string) => setContractId(v.trim())} />
          )}
        />
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => { }}>
            <ListItem
              coin={item}
              selected={item.address === contractId}
              onPress={() => setContractId(item.address)}
            />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.vars.Spacing.base }} />}
        ListHeaderComponent={() =>
          <View style={{ ...styles.paddingBase }}>
            <Text style={styles.sectionTitle}>{i18n.t('listed_coins')}</Text>
          </View>
        }
      />

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

const ListItem = (props: {
  coin: Coin,
  selected: boolean,
  onPress: Function
}) => {

  const theme = useTheme();
  const styles = theme.styles;

  return (
    <TouchableOpacity onPress={() => props.onPress(props.coin.address)}>
      <View style={{ ...styles.directionRow, ...styles.columnGapBase, ...styles.alignCenterColumn, paddingHorizontal: theme.vars.Spacing.base }}>
        <View style={{ width: 52 }}>
          <CoinLogo logo={props.coin.logo} size={48} />
        </View>

        <View>
          <Text>{props.coin.name}</Text>
          <Text style={styles.textSmall}>{props.coin.symbol}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const CoinLogo = (props: {
  logo: string,
  size: number
}) => {
  const theme = useTheme();
  const { Border } = theme.vars;

  return (
    <View style={{ borderRadius: props.size, borderColor: Border.color, borderWidth: Border.width, padding: 1 }}>
      {props.logo &&
        <Image style={{ width: props.size, height: props.size, borderRadius: props.size }} source={{ uri: props.logo }} />
      }
    </View>
  );
};