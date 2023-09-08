import { Image, TouchableHighlight, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useNfts, useNft } from '../hooks';
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
        style={{}}
        contentContainerStyle={{
          ...styles.directionRow,
          ...styles.alignCenterRow,
          ...styles.columnGapBase,
          ...styles.rowGapBase,
          flexWrap: 'wrap'
      }}>
        {
          data.map(item =>
            <NftItem key={item} id={item} />
          )
        }
        
      </ScrollView>
      
      <Footer />

    </ScrollView>
  );
}

const NftItem = (props: {
  id: string
}) => {
  const nft = useNft(props.id);
  const theme = useTheme();
  const styles = theme.styles;
  const { Border, Color } = theme.vars;
  const navigation = useNavigation<AssetsNavigationProp>();

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Nft', { id: props.id })}
      onLongPress={() => {
          SheetManager.show('nft', { payload: { id: props.id } });
      }}
      style={{
        borderRadius: Border.radius
      }}
    >
      <View style={{
        borderWidth: Border.width,
        borderColor: Border.color,
        borderRadius: Border.radius,
        backgroundColor: Color.base,
        padding: 1,
        maxWidth: 150
      }}>
        <Image source={{ uri: nft.image.get() }} resizeMode="contain" style={{
          width: 146,
          height: 146,
          borderRadius: Border.radius
        }} />
        <View style={{ ...styles.paddingSmall }}>
          <Text style={styles.textSmall}>{nft.name.get().substring(0, 19)}</Text>
        </View>

      </View>
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
