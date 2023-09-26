import { Keyboard, View } from 'react-native';
import { Button, TextInput, Wrapper, Screen, TextInputActionPaste } from '../components';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { SpinnerStore, SettingStore, AccountStore, LogStore } from '../stores';

export default () => {
  const [seed, setSeed] = useState('');
  const [name, setName] = useState('');
  const i18n = useI18n();
  const theme = useTheme();
  const styles = theme.styles;

  const importWallet = () => {
    Keyboard.dismiss();

    if (!name) {
      Toast.show({
        type: 'error',
        text1: i18n.t('missing_account_name')
      });
      return;
    }

    SpinnerStore.actions.showSpinner();

    setTimeout(() => {
      AccountStore.actions.addSeed({
        name: name.trim(),
        seed: seed.toLowerCase().trim()
      })
        .then(address => {
          SpinnerStore.actions.hideSpinner();
          SettingStore.actions.setCurrentAccount(address);
        })
        .catch(e => {
          SpinnerStore.actions.hideSpinner();
          LogStore.actions.logError(e);
          Toast.show({
            type: 'error',
            text1: i18n.t('unable_to_import_seed'),
            text2: i18n.t('check_seed'),
          });
        })
    }, 2000);

  };

  return (
    <Screen keyboardDismiss={true}>
      <Wrapper>
        <TextInput
          autoFocus={true}
          value={name}
          placeholder={i18n.t('account_name')}
          onChangeText={(text: string) => setName(text)} />

        <TextInput
          multiline={true}
          numberOfLines={4}
          value={seed}
          placeholder={i18n.t('seed_phrase')}
          onChangeText={(text: string) => setSeed(text)}
          actions={(
            <TextInputActionPaste onPaste={(value: string) => setSeed(value)} />
          )}
        />
      </Wrapper>

      <View style={styles.paddingBase}>
        <Button
          title={i18n.t('import')}
          icon={<Feather name="arrow-right" />}
          onPress={() => importWallet()} />
      </View>
    </Screen>
  );
}
