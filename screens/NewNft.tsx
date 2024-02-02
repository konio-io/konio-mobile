import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text } from '../components';
import { useCurrentNetwork, useI18n, useNftCollections } from '../hooks';
import { View, Keyboard, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../hooks';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { LogStore, SettingStore, SpinnerStore, NftCollectionStore, NameserverStore } from '../stores';
import { COLLECTIONS_URL } from '../lib/Constants';

type NFTCollection = {
  contractId: string,
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
  const [textLoading, setTextLoading] = useState(false);
  const [data, setData] = useState<Array<NFTCollection>>([]);
  const currentNetwork = useCurrentNetwork();
  const collections = useNftCollections();

  const add = async () => {
    Keyboard.dismiss();

    if (!contractId) {
      Toast.show({
        type: 'error',
        text1: i18n.t('missing_contract_address')
      });
      return;
    }

    SpinnerStore.actions.showSpinner();

    try {

      await NftCollectionStore.actions.addNftCollection(contractId);
      await NftCollectionStore.actions.refreshTokens(contractId);

      SpinnerStore.actions.hideSpinner();
      navigation.goBack();
      SettingStore.actions.showAskReview();
    } catch (e) {
      SpinnerStore.actions.hideSpinner();
      LogStore.actions.logError(String(e));
      Toast.show({
        type: 'error',
        text1: i18n.t('unable_to_add_nft'),
        text2: i18n.t('check_contract')
      });
    }
  };

  const _onChange = (v: string) => {
    setContractId(v)
  };

  const _onStopWriting = (v: string) => {
    if (NameserverStore.getters.validateNicQuery(v)) {
      setTextLoading(true);
      NameserverStore.getters.getAddress(v)
        .then(addr => {
          setTextLoading(false);
          if (addr) {
            setContractId(addr);
            NameserverStore.actions.add(addr, v);
          }
        })
        .catch(e => {
          setTextLoading(false);
        });
    }
  };

  const loadData = async () => {
    try {
      SpinnerStore.actions.showSpinner();
      const collectionListResponse = await fetch(`${COLLECTIONS_URL}/index.json`);
      const collectionMap: Array<NFTCollection> = await collectionListResponse.json();
      const collectionList = Object.values(collectionMap)
        .filter(collection => {
          return collection.chainId === currentNetwork.chainId
            && !collections.map(c => c.contractId).includes(collection.contractId)
        })
        .sort((a, b) => a.name > b.name ? 1 : -1);

      setData(collectionList);
      SpinnerStore.actions.hideSpinner();
    } catch (e) {
      SpinnerStore.actions.hideSpinner();
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Screen keyboardDismiss={true}>
      <View style={{ ...styles.paddingBase, ...styles.rowGapBase }}>
        <TextInput
          multiline={true}
          value={contractId}
          onChangeText={(v: string) => _onChange(v.trim())}
          placeholder={i18n.t('contract_address')}
          onStopWriting={(v: string) => _onStopWriting(v.trim())}
          loading={textLoading}
        />
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => { }}>
            <ListItem
              collection={item}
              selected={item.contractId === contractId}
              onPress={() => setContractId(item.contractId)}
            />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.vars.Spacing.base }} />}
        ListHeaderComponent={() =>
          <View style={{ ...styles.paddingBase }}>
            <Text style={styles.sectionTitle}>{i18n.t('listed_collections')}</Text>
          </View>
        }
      />

      <View style={styles.paddingBase}>
        <Button
          title={i18n.t('add_nft_collection')}
          onPress={() => add()}
          icon={<Feather name="plus" />}
        />
      </View>
    </Screen>
  );
}

const ListItem = (props: {
  collection: NFTCollection,
  selected: boolean,
  onPress: Function
}) => {

  const theme = useTheme();
  const styles = theme.styles;

  return (
    <TouchableOpacity onPress={() => props.onPress(props.collection.contractId)}>
      <View style={{ ...styles.directionRow, ...styles.columnGapBase, ...styles.alignCenterColumn, paddingHorizontal: theme.vars.Spacing.base }}>
        <View style={{ width: 52 }}>
          <Image style={{ width: 48, height: 48, borderRadius: 3 }} source={{ uri: props.collection.logo }} />
        </View>

        <View>
          <Text>{props.collection.name}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}