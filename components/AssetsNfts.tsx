import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useNftCollections, useI18n } from '../hooks';
import { Button, ButtonCircle } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { Feather, AntDesign } from '@expo/vector-icons';
import NftListItem from './NftListItem';
import { SheetManager } from 'react-native-actions-sheet';
import { Nft, NftCollection } from '../types/store';
import Text from './Text';
import { NftCollectionStore, NftStore } from '../stores';
import { useHookstate } from '@hookstate/core';
import { useState } from 'react';

export default () => {
  const theme = useTheme();
  const styles = theme.styles;
  const data = useNftCollections();
  const [refreshing, setRefreshing] = useState(false);

  const _refresh = async () => {
    setRefreshing(true);
    await NftStore.actions.refreshTokens();
    setRefreshing(false);
  };

  if (data.length === 0) {
    return <Footer />;
  }

  data.sort((a, b) => {
    return (a.name?.toUpperCase() ?? '') < (b.name?.toUpperCase() ?? '') ? -1 : 1;
  });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={_refresh} />
      }
      contentContainerStyle={{
        ...styles.alignCenterColumn,
        rowGap: theme.vars.Spacing.medium
      }}>
      {
        data
          .map(collection =>
            <NftCollectionListItem
              key={collection.id}
              nftCollection={collection}
            />
          )
      }

      <Footer />
    </ScrollView>
  );
}

const NftCollectionListItem = (props: {
  nftCollection: NftCollection
}) => {
  const { styles } = useTheme();
  const nfts = useHookstate(NftStore.state).get();
  const data = Object.values(nfts).filter(nft => nft.nftCollectionId === props.nftCollection.id);
  const i18n = useI18n();

  return (
    <TouchableOpacity
      onLongPress={() => {
        SheetManager.show('nft_collection', { payload: { nftCollectionId: props.nftCollection.id } });
      }}
    >
      <View style={{
        width: 330,
        ...styles.rowGapSmall
      }}>

        <Text style={styles.textMedium}>
          {props.nftCollection.name}
        </Text>


        <View style={{
          ...styles.directionRow,
          ...styles.columnGapBase,
          ...styles.rowGapBase,
          flexWrap: 'wrap'
        }}>
          {
            data.length > 0 && data.map(nft => <TouchableNftListItem key={nft.id} nft={nft} />)
          }
          {
            data.length === 0 &&
            <View style={{...styles.alignCenterColumn, width: '100%'}}>
              <Text>{i18n.t('no_assets')}</Text>
            </View>
          }
        </View>
      </View>
    </TouchableOpacity>
  )
}

const TouchableNftListItem = (props: {
  nft: Nft
}) => {
  const navigation = useNavigation<AssetsNavigationProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Nft', { nftId: props.nft.id })}
      onLongPress={() => {
        SheetManager.show('nft', { payload: { nftId: props.nft.id } });
      }}
    >
      <NftListItem nft={props.nft} />
    </TouchableOpacity>
  )
}

const Footer = () => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
      <ButtonCircle
        onPress={() => navigation.navigate('NewNft')}
        icon={(<Feather name="plus" />)}
        type='secondary'
      />
    </View>
  );
};
