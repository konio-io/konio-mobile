import { StyleSheet, View } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Button, TextInput, Wrapper } from '../components';
import { addSeed, setCurrentWallet } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import type { Theme } from '../types/store';
import { showToast } from '../actions';

export default () => {
  const seed = useHookstate('');
  const name = useHookstate('');
  const i18n = useI18n();
  const theme = useTheme();
  const styles = createStyles(theme)

  const importWallet = () => {
    if (!name.get()) {
      showToast({
        type: 'error',
        text1: i18n.t('missing_account_name')
      });
      return;
    }

    addSeed({
      name: name.get().trim(),
      seed: seed.get().toLowerCase().trim()
    })
      .then(address => {

        setCurrentWallet(address);
        showToast({
          type: 'success',
          text1: i18n.t('account_imported', {name: name.get()})
        });

      })
      .catch(e => {
        console.log(e);
        showToast({
          type: 'error',
          text1: i18n.t('unable_to_import_seed'),
          text2: i18n.t('check_seed'),
        });
      })
  };

  return (
    <Wrapper>

      <TextInput
        value={name.get()}
        placeholder={i18n.t('account_name')}
        onChangeText={(text: string) => name.set(text)} />

      <TextInput
        style={{...styles.textInputMultiline}}
        multiline={true}
        numberOfLines={4}
        value={seed.get()}
        placeholder={i18n.t('seed_phrase')}
        onChangeText={(text: string) => seed.set(text)}
      />

      <View style={styles.buttonContainer}>
        <View style={{ flex: 1 }}>
          <Button
            type="secondary"
            title={i18n.t('reset')}
            icon={<Feather name="x"/>}
            onPress={() => { seed.set('') }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Button
            title={i18n.t('import')}
            icon={<Feather name="arrow-right" />}
            onPress={() => importWallet()} />
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

