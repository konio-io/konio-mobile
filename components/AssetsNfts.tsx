import { Image, TouchableHighlight, View } from 'react-native';
import { State } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useI18n, useNfts, useNft, useCurrentNetworkId } from '../hooks';
import { Link, Text } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import Loading from '../screens/Loading';
import { SheetManager } from "react-native-actions-sheet";
import { ScrollView } from 'react-native-gesture-handler';
import { UserStore } from '../stores';

export default () => {
  return <></>;
  const currentAddress = useCurrentAddress();
  const currentAddressOrNull: State<string> | null = currentAddress.ornull;
  if (!currentAddressOrNull) {
    return <Loading />
  }
  const currentNetworkId = useCurrentNetworkId();

  const theme = useTheme();
  const styles = theme.styles;
  const accountNfts = useNfts();
  const data = accountNfts.get()
    .filter((id: string) => {
      const coin = UserStore.nfts[id];
      if (coin) {
        return coin.networkId.get() === currentNetworkId.get();
      }
      return false;
    });

  return (
    <View style={{ flex: 1 }}>

      <ScrollView contentContainerStyle={{
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
    </View>
  );
}

const NftItem = (props: {
  id: string
}) => {
  const nft = useNft(props.id).get();
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
        <Image source={{ uri: nft.image }} resizeMode="contain" style={{
          width: 146,
          height: 146,
          borderRadius: Border.radius
        }} />
        <View style={{ ...styles.paddingSmall }}>
          <Text style={styles.textSmall}>{nft.name.substring(0, 19)}</Text>
        </View>

      </View>
    </TouchableHighlight>
  )
}

const Footer = () => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const i18n = useI18n();

  return (
    <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
      <Link text={i18n.t('add_more_nfts')} onPress={() => navigation.navigate('NewNft')} />
    </View>
  );
};
