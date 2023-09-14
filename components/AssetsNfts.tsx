import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useNfts } from '../hooks';
import { ButtonCircle } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import NftCollectionListItem from './NftCollectionListItem';
import NftListItem from './NftListItem';
import { SheetManager } from 'react-native-actions-sheet';

export default () => {
  const theme = useTheme();
  const styles = theme.styles;
  const nfts = useNfts();
  const data = Object.keys(nfts.get());

  return (
    <ScrollView style={{ flex: 1 }}>

      <ScrollView
        contentContainerStyle={{
          ...styles.alignCenterColumn
        }}>
        {
          data.map(contractId =>
            <NftCollectionListItem
              key={contractId}
              contractId={contractId}
              renderItem={(tokenId: string) => <TouchableNftListItem key={tokenId} contractId={contractId} tokenId={tokenId} />}
            />
          )
        }

      </ScrollView>

      <Footer />

    </ScrollView>
  );
}

const TouchableNftListItem = (props: {
  contractId: string,
  tokenId: string
}) => {
  const { tokenId, contractId } = props;
  const navigation = useNavigation<AssetsNavigationProp>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Nft', { tokenId, contractId })}
      onLongPress={() => {
        SheetManager.show('nft', { payload: { tokenId, contractId } });
      }}
    >
      <NftListItem tokenId={tokenId} contractId={contractId} />
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
