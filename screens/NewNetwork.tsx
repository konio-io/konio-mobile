import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewNetworkNavigationProp } from '../types/navigation';
import { addNetwork, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen, Text, Wrapper } from '../components';
import { useI18n } from '../hooks';
import { View, StyleSheet, Alert } from 'react-native';
import { UserStore } from '../stores';
import { useTheme } from '../hooks';
import type { Network, Theme } from '../types/store';
import { DEFAULT_NETWORKS } from '../lib/Constants';

export default () => {
  const navigation = useNavigation<NewNetworkNavigationProp>();
  const i18n = useI18n();
  const theme = useTheme();
  const styles = createStyles(theme);
  const name = useHookstate('');
  const chainId = useHookstate('');
  const rpcNode = useHookstate('');
  const koinContractId = useHookstate('');
  const explorer = useHookstate('');

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

  const add = (replace = false) => {
    if (!name.get() || !chainId.get() || !rpcNode.get() || !koinContractId.get() || !explorer.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_data')
      });
      return;
    }

    if (UserStore.networks[chainId.get()].get() && replace === false) {
      showAlert();
      return;
    }

    const network: Network = {
      name: name.get(),
      chainId: chainId.get(),
      rpcNodes: [rpcNode.get()],
      koinContractId: koinContractId.get(),
      explorer: explorer.get()
    };

    addNetwork(network);
    showToast({
      type: 'success',
      text1: i18n.t('added', { name: name.get() }),
    });
    navigation.navigate('ChangeNetwork')
  };

  const reset = () => {
    const network = Object.values(DEFAULT_NETWORKS)[0];
    name.set(network.name);
    chainId.set(network.chainId);
    rpcNode.set(network.rpcNodes[0]);
    koinContractId.set(network.koinContractId);
    explorer.set(network.explorer);
  };

  return (
    <Screen>
      <Wrapper type="full">
        <View style={styles.inputGroup}>
          <TextInput
            autoFocus={true}
            value={name.get()}
            onChangeText={(v: string) => name.set(v)}
            placeholder={i18n.t('name')}
          />
          <Text style={styles.textSmall}>Ex: "My network"</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            autoFocus={true}
            value={chainId.get()}
            onChangeText={(v: string) => chainId.set(v)}
            placeholder={'chain id'}
          />
          <Text style={styles.textSmall}>Ex: EiBZK_GGVP0H_fXVAM3j6EAuz3-B-l3ejxRSewi7qIBfSA==</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            autoFocus={true}
            value={rpcNode.get()}
            onChangeText={(v: string) => rpcNode.set(v)}
            placeholder={'rpc node'}
          />
          <Text style={styles.textSmall}>Ex: https://api.koinosblocks.com</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            autoFocus={true}
            value={koinContractId.get()}
            onChangeText={(v: string) => koinContractId.set(v)}
            placeholder={'koin contract id'}
          />
          <Text style={styles.textSmall}>Ex: 15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL</Text>
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            autoFocus={true}
            value={explorer.get()}
            onChangeText={(v: string) => explorer.set(v)}
            placeholder={'explorer'}
          />
          <Text style={styles.textSmall}>Ex: https://koinosblocks.com</Text>
        </View>


        <View style={styles.screenFooter}>
          <Button
            type='secondary'
            style={{flex: 1}}
            title={i18n.t('default')}
            onPress={() => reset()}
            icon={<Feather name="refresh-cw" />}
          />
          <Button
            style={{flex: 1}}
            title={i18n.t('add_network')}
            onPress={() => add()}
            icon={<Feather name="plus" />}
          />
        </View>
      </Wrapper>
    </Screen>
  );
}

const createStyles = (theme: Theme) => {
  const { Spacing } = theme.vars;

  return StyleSheet.create({
    ...theme.styles,
    inputGroup: {
      rowGap: Spacing.small
    },
    screenFooter: {
      flexDirection: 'row',
      columnGap: Spacing.base
    }
  });
}