import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { State } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useWallet, useI18n, useCurrentKoin } from '../hooks';
import { Text, CoinList, AccountAvatar, ManaBar, CoinListItem, Screen, Address, Selector, Link } from '../components';
import type { Theme } from '../types/store';
import { AccountNavigationProp, } from '../types/navigation';
import Loading from './Loading';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
  const currentAddress = useCurrentAddress();
  const currentAddressOrNull: State<string> | null = currentAddress.ornull;
  if (!currentAddressOrNull) {
    return <Loading />
  }

  const wallet = useWallet(currentAddressOrNull.get()).get();
  const theme = useTheme();
  const { Spacing } = theme.vars;
  const styles = createStyles(theme);
  const navigation = useNavigation<AccountNavigationProp>();

  return (
    <Screen>
      <View style={{ padding: Spacing.base }}>
        <Selector onPress={() => navigation.navigate('SwitchAccount')}>
          <View style={styles.switchContainer}>
            <AccountAvatar size={48} address={wallet.address} />
            <View>
              <Text style={styles.textTitle}>{wallet.name}</Text>
              <Address address={wallet.address} compress={true} copiable={true}/>
            </View>
          </View>
        </Selector>
      </View>

      <ManaBar />

      <CoinList renderItem={(contractId: string) => <TouchableCoinListItem contractId={contractId} />} />

      <Footer />

    </Screen>
  );
}

const TouchableCoinListItem = (props: {
  contractId: string,
}) => {
  const navigation = useNavigation<AccountNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const currentKoin = useCurrentKoin();

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('Coin', { contractId: props.contractId })}
      onLongPress={() => {
        if (props.contractId !== currentKoin.get()) {
          SheetManager.show('coin', { payload: { contractId: props.contractId } });
        }
      }}
    >
      <View style={styles.listItemContainer}>
        <CoinListItem contractId={props.contractId} />
      </View>
    </TouchableHighlight>
  );
}

const Footer = () => {
  const navigation = useNavigation<AccountNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const i18n = useI18n();

  return (
    <View style={styles.addMoreContainer}>
      <Link text={i18n.t('add_more_coins')} onPress={() => navigation.navigate('NewCoin')} />
    </View>
  );
};


const createStyles = (theme: Theme) => {
  const { Spacing } = theme.vars;

  return StyleSheet.create({
    ...theme.styles,
    walletContainer: {
      alignItems: 'center',
      rowGap: Spacing.small
    },
    walletNameContainer: {
      alignItems: 'center'
    },
    switchContainer: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      columnGap: Spacing.base
    }
  });
}
