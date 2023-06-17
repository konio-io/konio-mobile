import { FlatList, View } from 'react-native';
import { useNetworks, useCurrentNetworkId, useNetwork, useTheme } from '../hooks';
import { UserStore } from '../stores';
import { setCurrentNetwork, showToast } from '../actions';
import { ListItemSelected, Text, Wrapper } from '../components';
import i18n from '../locales';

export default () => {
  const networks = useNetworks();

  const theme = useTheme().get();
  const styles = theme.styles;

  return (
    <Wrapper type="full">

      <FlatList
        data={networks.get().map(n => n.chainId)}
        renderItem={({ item }) => <ListItem networkId={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

    </Wrapper>
  );
}

export const ListItem = (props: {
  networkId: string
}) => {

  const currentNetworkId = useCurrentNetworkId();
  const network = useNetwork(props.networkId);
  const theme = useTheme().get();
  const styles = theme.styles;

  const ItemComponent = () => (
    <View>
      <Text>{network.get().name}</Text>
      <Text style={styles.textSmall}>{network.get().rpcNodes.join("\n")}</Text>
    </View>
  );

  const selected = currentNetworkId.get() === props.networkId;

  const changeNetwork = () => {
    setCurrentNetwork(props.networkId);
    showToast({
      type: 'info',
      text1: i18n.t('network_changed', {network: UserStore.networks[props.networkId].name.get()})
    });
  }

  return <ListItemSelected ItemComponent={ItemComponent} selected={selected} onPress={changeNetwork}/>
}
