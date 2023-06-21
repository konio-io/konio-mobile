import { StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native';
import { State } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useWallet, useI18n } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { Text, Button, CoinList, WalletAvatar, ManaBar, CoinListItem, Wrapper, Address, Selector } from '../components';
import type { Theme } from '../types/store';
import type { WalletNavigationProp } from '../types/navigation';
import Loading from './Loading';

export default () => {
  const i18n = useI18n();
  const currentAddress = useCurrentAddress();
  const currentAddressOrNull: State<string> | null = currentAddress.ornull;
  if (!currentAddressOrNull) {
    return <Loading />
  }

  const wallet = useWallet(currentAddressOrNull.get()).get();
  const theme = useTheme();
  const { Spacing, Border } = theme.vars;
  const styles = createStyles(theme);
  const navigation = useNavigation<WalletNavigationProp>();

  return (
    <Wrapper type="full">

      <View style={styles.header}>

        <View style={styles.headerContent}>

          <Selector onPress={() => navigation.push('SwitchAccount')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: Spacing.base }}>
              <WalletAvatar size={48} address={wallet.address} name={wallet.name} />
              <View>
                <Text style={styles.textTitle}>{wallet.name}</Text>
                <Address address={wallet.address} compress={true} />
              </View>
            </View>
          </Selector>

          <View style={styles.buttonsContainer}>
            <Button
              style={{ flex: 1 }}
              title={i18n.t('send')}
              onPress={() => navigation.navigate('Withdraw', { screen: 'SelectRecipient' })}
              icon={<Feather name="arrow-up-right" />}
            />
            <Button
              style={{ flex: 1 }}
              title={i18n.t('receive')}
              onPress={() => navigation.navigate('Deposit')}
              icon={<Feather name="arrow-down-right" />}
              type='secondary'
            />
          </View>

        </View>

      </View>

      <ManaBar />

      <CoinList
        FooterComponent={Footer}
        renderItem={(contractId: string) => {
          return <CoinListItem contractId={contractId} onPress={() => navigation.push('Coin', { contractId })} />
        }}
      />

    </Wrapper>
  );
}

const Footer = (props: {
  onPress: Function
}) => {
  const navigation = useNavigation<WalletNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const i18n = useI18n();

  return (
    <View style={styles.addMoreContainer}>
      <Pressable onPress={() => navigation.push('AddCoin')}>
        <Text style={styles.link}>{i18n.t('add_more_coins')}</Text>
      </Pressable>
    </View>
  );
};


const createStyles = (theme: Theme) => {
  const { Spacing, Color, Border } = theme.vars;

  return StyleSheet.create({
    ...theme.styles,
    header: {
      height: 200,
      borderBottomWidth: Border.width,
      borderBottomColor: Border.color,
      backgroundColor: Color.base,
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: Spacing.base
    },
    headerContent: {
      width: 300,
      rowGap: Spacing.small
    },
    walletContainer: {
      alignItems: 'center',
      rowGap: Spacing.small
    },
    walletNameContainer: {
      alignItems: 'center'
    },
    buttonsContainer: {
      height: 40,
      flexDirection: 'row',
      columnGap: Spacing.small
    },
    addMoreContainer: {
      alignItems: 'center',
      padding: Spacing.base
    }
  });
}