import { Image, TouchableHighlight, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useNfts, useNft, useNftCollection } from '../hooks';
import { ButtonCircle, Text } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

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
          data.map(item =>
            <NftCollection key={item} contractId={item} />
          )
        }

      </ScrollView>

      <Footer />

    </ScrollView>
  );
}

const NftCollection = (props: {
  contractId: string
}) => {
  const theme = useTheme();
  const styles = theme.styles;
  const collection = useNftCollection(props.contractId);
  if (!collection.ornull) {
    return <></>;
  }

  return (
    <View style={{
      width: 330,
      ...styles.rowGapSmall
    }}>
      <Text style={{...styles.textMedium, ...styles.textBold}}>
        {collection.name.get()}
      </Text>

      <View style={{
        ...styles.directionRow,
        ...styles.columnGapBase,
        ...styles.rowGapBase,
        flexWrap: 'wrap'
      }}>
        {
          Object.keys(collection.tokens.get()).map(item =>
            <Nft key={item} tokenId={item} contractId={props.contractId} />
          )
        }
      </View>
    </View>
  )
}

const Nft = (props: {
  contractId: string,
  tokenId: string
}) => {
  const { tokenId, contractId } = props;
  const nft = useNft({ tokenId, contractId });
  const theme = useTheme();
  const { Border, Color } = theme.vars;
  const navigation = useNavigation<AssetsNavigationProp>();

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Nft', { tokenId, contractId })}
      onLongPress={() => {
        SheetManager.show('nft', { payload: { tokenId: props.tokenId, contractId: props.contractId } });
      }}
      style={{
        borderRadius: Border.radius
      }}
    >
      
        <Image source={{ uri: nft.image.get() }} resizeMode="contain" style={{
          width: 100,
          height: 100,
          borderRadius: Border.radius,
          borderWidth: Border.width,
          borderColor: Border.color,
          backgroundColor: Color.base,
        }} />
      
    </TouchableHighlight>
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
