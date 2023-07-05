import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { State } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useI18n, useCurrentKoin } from '../hooks';
import { CoinList, ManaBar, CoinListItem, Screen, Link, DrawerToggler, MoreVertical } from '../components';
import type { Theme } from '../types/store';
import { AssetsCoinsNavigationProp, } from '../types/navigation';
import Loading from './Loading';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect } from 'react';

export default () => {
  const currentAddress = useCurrentAddress();
  const navigation = useNavigation<AssetsCoinsNavigationProp>();

  useEffect(() => {
    navigation.setOptions({
        headerTitleAlign: 'center',
        headerLeft: () => (<DrawerToggler/>),
        headerRight: () => (<MoreVertical onPress={() => SheetManager.show('account', { payload: { address: currentAddress.get() } })}/>),
        title: ''
    });
}, [navigation]);

  const currentAddressOrNull: State<string> | null = currentAddress.ornull;
  if (!currentAddressOrNull) {
    return <Loading />
  }

  return (
    <Screen>
      <ManaBar />
      <CoinList renderItem={(contractId: string) => <TouchableCoinListItem contractId={contractId} />} />
      <Footer />
    </Screen>
  );
}

const TouchableCoinListItem = (props: {
  contractId: string,
}) => {
  const navigation = useNavigation<AssetsCoinsNavigationProp>();
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
  const navigation = useNavigation<AssetsCoinsNavigationProp>();
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
