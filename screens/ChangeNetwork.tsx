import { FlatList, View } from 'react-native';
import { useNetworks, useCurrentNetworkId, useNetwork, useTheme, useI18n } from '../hooks';
import { UserStore } from '../stores';
import { setCurrentNetwork, showToast } from '../actions';
import { ListItemSelected, Separator, Text, Screen } from '../components';

export default () => {
  const networks = useNetworks();

  return (
    <Screen>

      <FlatList
        data={networks.get().map(n => n.chainId)}
        renderItem={({ item }) => <ListItem networkId={item} />}
        ItemSeparatorComponent={() => <Separator/>}
      />

    </Screen>
  );
}

export const ListItem = (props: {
  networkId: string
}) => {

  const i18n = useI18n();
  const currentNetworkId = useCurrentNetworkId();
  const network = useNetwork(props.networkId);
  const theme = useTheme();
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
