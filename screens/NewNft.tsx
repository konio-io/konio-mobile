import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n } from '../hooks';
import { View, Keyboard } from 'react-native';
import { useTheme } from '../hooks';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useStore } from '../stores';

export default () => {
  const navigation = useNavigation<NewCoinNavigationProp>();
  const [contractId, setContractId] = useState('');
  const [tokenId, setTokenId] = useState('');
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;
  const { Log, Setting, Spinner, Nft, NftCollection } = useStore();

  const add = async () => {
    Keyboard.dismiss();

    if (!contractId) {
      Toast.show({
        type: 'error',
        text1: i18n.t('missing_contract_address')
      });
      return;
    }

    if (!tokenId) {
      Toast.show({
        type: 'error',
        text1: i18n.t('missing_token_id')
      });
      return;
    }

    Spinner.actions.showSpinner();

    try {
      await NftCollection.actions.addNftCollection(contractId);
      await Nft.actions.addNft({
        contractId: contractId,
        tokenId: tokenId
      });
      Spinner.actions.hideSpinner();
      navigation.goBack();
      Setting.actions.showAskReview();
    } catch (e) {
      Spinner.actions.hideSpinner();
      Log.actions.logError(String(e));
      Toast.show({
        type: 'error',
        text1: i18n.t('unable_to_add_nft'),
        text2: i18n.t('check_contract')
      });
    }
  };

  return (
    <Screen keyboardDismiss={true}>
      <View style={{ ...styles.paddingBase, ...styles.rowGapBase }}>
        <TextInput
          multiline={true}
          autoFocus={true}
          value={contractId}
          onChangeText={(v: string) => setContractId(v.trim())}
          placeholder={i18n.t('contract_address')}
        />
        <TextInput
          value={tokenId}
          onChangeText={(v: string) => setTokenId(v.trim())}
          placeholder={i18n.t('token_id')}
        />
      </View>

      <View style={styles.paddingBase}>
        <Button
          title={i18n.t('add_nft')}
          onPress={() => add()}
          icon={<Feather name="plus" />}
        />
      </View>
    </Screen>
  );
}