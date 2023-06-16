import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import type { AddCoinNavigationProp } from '../types/navigation';
import { addCoin, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import { Text, TextInput, ButtonPrimary, Wrapper } from '../components';

export default () => {
  const navigation = useNavigation<AddCoinNavigationProp>();
  const contractId = useHookstate(''); //1JZqj7dDrK5LzvdJgufYBJNUFo88xBoWC8
  const error = useHookstate('');
  const theme = useTheme().get();
  const { Color } = theme.vars;
  const styles = theme.styles;

  const add = () => {
    if (!contractId.get()) {
      showToast({
        type: 'error',
        text1: 'Missing contract address'
      });
      return;
    }

    addCoin(contractId.get())
      .then(coin => {

        showToast({
          type: 'success',
          text1: `Coin "${coin.symbol}" added`,
        });
        navigation.push('Wallet');

      })
      .catch(e => {
        showToast({
          type: 'error',
          text1: 'Unable to add coin',
          text2: 'Check the contract address/network and try again'
        });
      });
  };

  return (
    <Wrapper>
      <TextInput
        value={contractId.get()}
        onChangeText={(v: string) => contractId.set(v)}
        placeholder='Contract address'
      />

      <ButtonPrimary
        title="Add coin"
        onPress={() => add()}
        icon={<Feather name="plus" size={18} color={Color.primaryContrast} />}
      />

      <Text style={styles.textError}>{error.get()}</Text>
    </Wrapper>
  );
}