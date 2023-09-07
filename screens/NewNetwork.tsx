import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewNetworkNavigationProp } from '../types/navigation';
import { addNetwork, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n } from '../hooks';
import { View, Alert } from 'react-native';
import { UserStore } from '../stores';
import { useTheme } from '../hooks';
import type { Network } from '../types/store';
import { DEFAULT_NETWORKS } from '../lib/Constants';
import { ScrollView } from 'react-native-gesture-handler';
import { Provider } from 'koilib';

export default () => {
  const DEFAULT_NETWORK = Object.values(DEFAULT_NETWORKS)[0];
  const navigation = useNavigation<NewNetworkNavigationProp>();
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;
  const name = useHookstate('');
  const rpcNode = useHookstate('');
  const explorer = useHookstate('');
  const koinContractId = useHookstate('');

  const showAlert = () => {
    return Alert.alert(
      i18n.t('are_you_sure'),
      i18n.t('are_you_sure_replace_network'),
      [
        {
          text: i18n.t('yes'),
          onPress: () => add(true)
        },
        {
          text: i18n.t('no'),
        },
      ]
    );
  };

  const add = async (replace = false) => {
    if (!name.get() || !rpcNode.get() || !explorer.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_data')
      });
      return;
    }

    const provider = new Provider([rpcNode.get()]);
    const chainId = await provider.getChainId();

    if (!chainId) {
      showToast({
        type: 'error',
        text1: i18n.t('wrong_rpc_node')
      });
      return;
    }

    if (UserStore.networks[chainId].get() && replace === false) {
      showAlert();
      return;
    }

    const network: Network = {
      name: name.get(),
      chainId: chainId,
      rpcNodes: [rpcNode.get()],
      koinContractId: koinContractId.get(),
      explorer: explorer.get()
    };

    addNetwork(network);
    navigation.navigate('ChangeNetwork')
  };

  const reset = () => {
    name.set(DEFAULT_NETWORK.name);
    rpcNode.set(DEFAULT_NETWORK.rpcNodes[0]);
    explorer.set(DEFAULT_NETWORK.explorer);
    koinContractId.set(DEFAULT_NETWORK.koinContractId);
  };

  return (
    <Screen>
      
        <ScrollView contentContainerStyle={{...styles.paddingBase, ...styles.rowGapBase}}>
          
            <TextInput
              autoFocus={true}
              value={name.get()}
              onChangeText={(v: string) => name.set(v)}
              placeholder={i18n.t('name')}
              note={`Ex: ${DEFAULT_NETWORK.name}`}
            />
          
            <TextInput
              value={rpcNode.get()}
              onChangeText={(v: string) => rpcNode.set(v)}
              placeholder={'rpc node'}
              note={`Ex: ${DEFAULT_NETWORK.rpcNodes[0]}`}
            />

            <TextInput
              value={explorer.get()}
              onChangeText={(v: string) => explorer.set(v)}
              placeholder={'explorer'}
              note={`Ex: ${DEFAULT_NETWORK.explorer}`}
            />

            <TextInput
              value={koinContractId.get()}
              onChangeText={(v: string) => koinContractId.set(v)}
              placeholder={'KOIN contract ID'}
              note={`Ex: ${DEFAULT_NETWORK.koinContractId}`}
            />

        </ScrollView>
        
        <View style={{...styles.paddingBase, ...styles.directionRow, ...styles.columnGapBase}}>
          <Button
            type='secondary'
            style={{ flex: 1 }}
            title={i18n.t('default')}
            onPress={() => reset()}
            icon={<Feather name="refresh-cw" />}
          />
          <Button
            style={{ flex: 1 }}
            title={i18n.t('add_network')}
            onPress={() => add()}
            icon={<Feather name="plus" />}
          />
        </View>

    </Screen>
  );
}