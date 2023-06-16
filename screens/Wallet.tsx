import { StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native';
import { State } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useWallet } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { Text, ButtonPrimary, ButtonPrimaryEmpty, CoinList, WalletAvatar, ManaBar, CoinListItem, Wrapper } from '../components';
import type { Theme } from '../types/store';
import type { WalletNavigationProp } from '../types/navigation';
import Loading from './Loading';

export default () => {

  const currentAddress = useCurrentAddress();
  const currentAddressOrNull: State<string> | null = currentAddress.ornull;
  if (!currentAddressOrNull) {
    return <Loading />
  }

  const wallet = useWallet(currentAddressOrNull.get()).get();
  const theme = useTheme().get();
  const { Color } = theme.vars;
  const styles = createStyles(theme);
  const navigation = useNavigation<WalletNavigationProp>();

  return (
    <Wrapper type="full">

      <View style={styles.header}>

        <View style={styles.headerContent}>

          <View style={styles.walletContainer}>
            <Pressable onPress={() => navigation.push('SwitchWallet')}>
                <WalletAvatar size={64} address={wallet.address} name={wallet.name} />
            </Pressable>

            <View style={styles.walletNameContainer}>
              <Text style={styles.textTitle}>{wallet.name}</Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <ButtonPrimary
              style={{ flex: 1 }}
              title="Send"
              onPress={() => navigation.push('Withdraw', {})}
              icon={<Feather name="arrow-up-right" size={18} color={Color.primaryContrast} />}
            />
            <ButtonPrimaryEmpty
              style={{ flex: 1 }}
              title="Receive"
              onPress={() => navigation.push('Deposit')}
              icon={<Feather name="arrow-down-right" size={18} color={Color.primary} />}
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
  const theme = useTheme().get();
  const styles = createStyles(theme);

  return (
    <View style={styles.addMoreContainer}>
      <Pressable onPress={() => navigation.push('AddCoin')}>
        <Text style={styles.link}>Add more coins...</Text>
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
      columnGap: Spacing.base
    },
    addMoreContainer: {
      alignItems: 'center',
      padding: Spacing.base
    }
  });
}