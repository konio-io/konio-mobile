import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { addNft, addNftCollection, askReview, logError, showSpinner, hideSpinner, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n } from '../hooks';
import { View, Keyboard } from 'react-native';
import { useTheme } from '../hooks';
import { useState } from 'react';

export default () => {
  const navigation = useNavigation<NewCoinNavigationProp>();
  const [contractId, setContractId] = useState('');
  const [tokenId, setTokenId] = useState('');
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;

  const add = () => {
    Keyboard.dismiss();

    if (!contractId) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_contract_address')
      });
      return;
    }

    if (!tokenId) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_token_id')
      });
      return;
    }

    showSpinner();

    addNftCollection(contractId)
    .then(nftCollection => {
        addNft({
          contractId: contractId,
          tokenId: tokenId
        })
        .then(nft => {
          hideSpinner();
          navigation.goBack();
          askReview();
        });
    })
    .catch(e => {
      hideSpinner();
      logError(e);
      showToast({
        type: 'error',
        text1: i18n.t('unable_to_add_nft'),
        text2: i18n.t('check_contract')
      });
    });
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