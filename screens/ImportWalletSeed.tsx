import { StyleSheet, View } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { ButtonPrimary, ButtonPrimaryEmpty, TextInput, Wrapper } from '../components';
import { addSeed, setCurrentWallet } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import { showToast } from '../actions';

export default () => {
  //impulse stadium turtle bird uncle call six accident file exclude include like
  const seed = useHookstate('');
  const name = useHookstate('');

  const theme = useTheme().get();
  const { Color } = theme.vars;
  const styles = createStyles(theme)

  const importWallet = () => {
    if (!name.get()) {
      showToast({
        type: 'error',
        text1: 'Missing account name'
      });
      return;
    }

    addSeed({
      name: name.get().trim(),
      seed: seed.get().trim()
    })
      .then(address => {

        setCurrentWallet(address);
        showToast({
          type: 'success',
          text1: `Account "${name.get()}" imported`
        });

      })
      .catch(e => {
        console.log(e);
        showToast({
          type: 'error',
          text1: 'Unable to import via seed phrase',
          text2: 'Check it and try again',
        });
      })
  };

  return (
    <Wrapper>

      <TextInput
        value={name.get()}
        placeholder='Account name'
        onChangeText={(text: string) => name.set(text)} />

      <TextInput
        style={{...styles.textInputMultiline}}
        multiline={true}
        numberOfLines={4}
        value={seed.get()}
        placeholder='Seed phrase'
        onChangeText={(text: string) => seed.set(text.toLowerCase())}
      />

      <View style={styles.buttonContainer}>
        <View style={{ flex: 1 }}>
          <ButtonPrimaryEmpty
            title="Reset"
            icon={<Feather name="x" size={16} color={Color.primary} />}
            onPress={() => { seed.set('') }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ButtonPrimary
            title="Import"
            icon={<Feather name="arrow-right" size={18} color={Color.primaryContrast} />}
            onPress={() => importWallet()
            } />
        </View>
      </View>

    </Wrapper>
  );
}

const createStyles = (theme: Theme) => {
  const { Spacing } = theme.vars;

  return StyleSheet.create({
    ...theme.styles,
    buttonContainer: {
      flexDirection: 'row',
      columnGap: Spacing.base
    }
  });
}

