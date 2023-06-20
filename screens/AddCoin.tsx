import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { AddCoinNavigationProp } from '../types/navigation';
import { addCoin, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { TextInput, Button, Wrapper } from '../components';
import i18n from '../locales';

export default () => {
  const navigation = useNavigation<AddCoinNavigationProp>();
  const contractId = useHookstate('');

  const add = () => {
    if (!contractId.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_contract_address')
      });
      return;
    }

    addCoin(contractId.get())
      .then(coin => {

        showToast({
          type: 'success',
          text1: i18n.t('coin_added', {symbol: coin.symbol}),
        });
        navigation.push('Wallet');

      })
      .catch(e => {
        showToast({
          type: 'error',
          text1: i18n.t('unable_to_add_coin'),
          text2: i18n.t('check_contract')
        });
      });
  };

  return (
    <Wrapper>
      <TextInput
        value={contractId.get()}
        onChangeText={(v: string) => contractId.set(v.trim())}
        placeholder={i18n.t('contract_address')}
      />

      <Button
        title="Add coin"
        onPress={() => add()}
        icon={<Feather name="plus"/>}
      />
    </Wrapper>
  );
}