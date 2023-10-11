import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useNftCollections } from '../hooks';
import { ButtonCircle } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import NftListItem from './NftListItem';
import { SheetManager } from 'react-native-actions-sheet';
import { Nft, NftCollection } from '../types/store';
import Text from './Text';
import { NftStore } from '../stores';
import { useHookstate } from '@hookstate/core';

export default () => {
  const theme = useTheme();
  const styles = theme.styles;
  const data = useNftCollections();

  if (data.length === 0) {
    return <Footer/>;
  }

  data.sort((a, b) => {
    return (a.name?.toUpperCase() ?? '') < (b.name?.toUpperCase() ?? '') ? -1 : 1;
  });

  return (
    <ScrollView
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
  const { styles, vars } = useTheme();
  const nfts = useHookstate(NftStore.state).get();
  const data = Object.values(nfts).filter(nft => nft.nftCollectionId === props.nftCollection.id);

  return (
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
          data.map(nft => <TouchableNftListItem key={nft.id} nft={nft} />)
        }
      </View>
    </View>
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
