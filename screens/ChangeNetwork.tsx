import { FlatList, View } from 'react-native';
import { useNetworks, useCurrentNetworkId, useTheme, useI18n } from '../hooks';
import { setCurrentNetwork } from '../actions';
import { ListItemSelected, Separator, Text, Screen, Link } from '../components';
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';
import { ChangeNetworkNavigationProp } from '../types/navigation';
import { DEFAULT_NETWORKS } from '../lib/Constants';
import { ImmutableObject } from '@hookstate/core';
import { Network } from '../types/store';

export default () => {
  const networks = useNetworks();

  return (
    <Screen>
      <FlatList
        data={Object.values(networks.get())}
        renderItem={({ item }) => <ListItem network={item} />}
      />
      <Footer />
    </Screen>
  );
}

export const ListItem = (props: {
  network: ImmutableObject<Network>
}) => {
  const currentNetworkId = useCurrentNetworkId().get();
  const theme = useTheme();
  const styles = theme.styles;
  const { network } = props;
  const selected = currentNetworkId === network.chainId;

  const changeNetwork = () => {
    setCurrentNetwork(network.chainId);
  }

  return <ListItemSelected
    ItemComponent={(
      <View>
        <Text>{network.name}</Text>
        <Text style={styles.textSmall}>{network.rpcNodes[0]}</Text>
      </View>
    )}
    selected={selected}
    onPress={changeNetwork}
    onLongPress={() => {
      if (!Object.keys(DEFAULT_NETWORKS).includes(network.chainId)) {
        SheetManager.show('network', { payload: { networkId: network.chainId } });
      }
    }}
  />
}

const Footer = () => {
  const navigation = useNavigation<ChangeNetworkNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const i18n = useI18n();

  return (
    <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
      <Link text={i18n.t('add_network')} onPress={() => navigation.navigate('NewNetwork')} />
    </View>
  );
};