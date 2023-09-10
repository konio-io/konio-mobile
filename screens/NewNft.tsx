import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { NewCoinNavigationProp } from '../types/navigation';
import { addNft, addNftCollection, askReview, logError, showSpinner, hideSpinner, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Screen } from '../components';
import { useI18n } from '../hooks';
import { View, Keyboard } from 'react-native';
import { useTheme } from '../hooks';

export default () => {
  const navigation = useNavigation<NewCoinNavigationProp>();
  const contractId = useHookstate('');
  const tokenId = useHookstate('');
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;

  const add = () => {
    Keyboard.dismiss();

    if (!contractId.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_contract_address')
      });
      return;
    }

    if (!tokenId.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_token_id')
      });
      return;
    }

    showSpinner();

    addNftCollection(contractId.get())
    .then(nftCollection => {
        addNft({
          contractId: contractId.get(),
          tokenId: tokenId.get()
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
          value={contractId.get()}
          onChangeText={(v: string) => contractId.set(v.trim())}
          placeholder={i18n.t('contract_address')}
        />
        <TextInput
          value={tokenId.get()}
          onChangeText={(v: string) => tokenId.set(v.trim())}
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