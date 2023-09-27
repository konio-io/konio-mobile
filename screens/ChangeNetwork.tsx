import { FlatList, View } from 'react-native';
import { useCurrentNetworkId, useTheme } from '../hooks';
import { ListItemSelected, Text, Screen, ButtonCircle } from '../components';
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';
import { ChangeNetworkNavigationProp } from '../types/navigation';
import { DEFAULT_NETWORKS } from '../lib/Constants';
import { ImmutableObject, useHookstate } from '@hookstate/core';
import { Network } from '../types/store';
import { Feather } from '@expo/vector-icons';
import { NetworkStore, SettingStore } from '../stores';

export default () => {
  const networks = useHookstate(NetworkStore.state).get();

  return (
    <Screen>
      <FlatList
        data={Object.values(networks)}
        renderItem={({ item }) => <ListItem network={item} />}
        ListFooterComponent={(<Footer />)}
      />
    </Screen>
  );
}

export const ListItem = (props: {
  network: ImmutableObject<Network>
}) => {
  const currentNetworkId = useCurrentNetworkId();
  const theme = useTheme();
  const styles = theme.styles;
  const { network } = props;
  const selected = currentNetworkId === network.id;

  const changeNetwork = () => {
    SettingStore.actions.setCurrentNetwork(network.id);
  };

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
      if (!Object.keys(DEFAULT_NETWORKS).includes(network.id)) {
        SheetManager.show('network', { payload: { networkId: network.id } });
      }
    }}
  />
}

const Footer = () => {
  const navigation = useNavigation<ChangeNetworkNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;

  return (
    <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
      <ButtonCircle 
        onPress={() => navigation.navigate('NewNetwork')} 
        icon={(<Feather name="plus" />)}
        type='secondary'
      />
    </View>
  );
};