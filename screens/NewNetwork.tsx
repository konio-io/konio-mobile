import { useNavigation } from '@react-navigation/native';
import type { NewNetworkNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n } from '../hooks';
import { View, Alert, ScrollView } from 'react-native';
import { useTheme } from '../hooks';
import type { Network } from '../types/store';
import { DEFAULT_NETWORKS } from '../lib/Constants';
import { Provider } from 'koilib';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { NetworkStore } from '../stores';

export default () => {
  const DEFAULT_NETWORK = Object.values(DEFAULT_NETWORKS)[0];
  const navigation = useNavigation<NewNetworkNavigationProp>();
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;
  const [name, setName] = useState('');
  const [rpcNode, setRpcNode] = useState('');
  const [koinContractId, setKoinContractId] = useState('');

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
    if (!name || !rpcNode) {
      Toast.show({
        type: 'error',
        text1: i18n.t('missing_data')
      });
      return;
    }

    const provider = new Provider([rpcNode]);
    const chainId = await provider.getChainId();

    if (!chainId) {
      Toast.show({
        type: 'error',
        text1: i18n.t('wrong_rpc_node')
      });
      return;
    }

    if (NetworkStore.state.nested(chainId) && replace === false) {
      showAlert();
      return;
    }

    const network: Network = {
      id: chainId,
      name: name,
      chainId: chainId,
      rpcNodes: [rpcNode],
      koinContractId: koinContractId
    };

    NetworkStore.actions.addNetwork(network);
    navigation.navigate('ChangeNetwork')
  };

  const reset = () => {
    setName(DEFAULT_NETWORK.name);
    setRpcNode(DEFAULT_NETWORK.rpcNodes[0]);
    setKoinContractId(DEFAULT_NETWORK.koinContractId);
  };

  return (
    <Screen keyboardDismiss={true}>
      
        <ScrollView contentContainerStyle={{...styles.paddingBase, ...styles.rowGapBase}}>
          
            <TextInput
              autoFocus={true}
              value={name}
              onChangeText={(v: string) => setName(v)}
              placeholder={i18n.t('name')}
              note={`Ex: ${DEFAULT_NETWORK.name}`}
            />
          
            <TextInput
              value={rpcNode}
              onChangeText={(v: string) => setRpcNode(v)}
              placeholder={'rpc node'}
              note={`Ex: ${DEFAULT_NETWORK.rpcNodes[0]}`}
            />

            <TextInput
              value={koinContractId}
              onChangeText={(v: string) => setKoinContractId(v)}
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