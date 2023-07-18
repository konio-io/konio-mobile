import { TouchableHighlight, View } from 'react-native';
import { State } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useI18n, useCurrentKoin, useCoinValue, useAccount } from '../hooks';
import { CoinList, ManaBar, CoinListItem, Screen, Link, DrawerToggler, MoreVertical, Text, Address } from '../components';
import { AssetsCoinsNavigationProp, } from '../types/navigation';
import Loading from './Loading';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect } from 'react';

export default () => {
  const currentAddress = useCurrentAddress();
  const currentAddressOrNull: State<string> | null = currentAddress.ornull;
  if (!currentAddressOrNull) {
    return <Loading />
  }

  const navigation = useNavigation<AssetsCoinsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const currentKoin = useCurrentKoin();
  const coinValue = useCoinValue(currentKoin.get());
  const i18n = useI18n();
  const account = useAccount(currentAddressOrNull.get());

  useEffect(() => {
    navigation.setOptions({
      title: account.name.get(),
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerLeft: () => (<DrawerToggler />),
      headerRight: () => (<MoreVertical onPress={() => SheetManager.show('account', { payload: { address: currentAddress.get() } })} />),
      headerTitle: () => (<></>)
    });
  }, [navigation]);

  

  return (
    <Screen>
      <View style={{ ...styles.rowGapBase }}>
        <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.alignSpaceBetweenRow }}>
          <View>
            <Text style={styles.textXlarge}>${coinValue.get() && coinValue.get().toFixed(2)}</Text>
            <Text style={styles.textSmall}>{i18n.t('total_balance')}</Text>
          </View>

          <View style={styles.alignCenterColumn}>
            <Text style={styles.textMedium}>{account.name.get()}</Text>
            <Address address={currentAddressOrNull.get()} copiable={true}/>
          </View>
        </View>

        <ManaBar />
      </View>

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
  const styles = theme.styles;
  const i18n = useI18n();

  return (
    <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
      <Link text={i18n.t('add_more_coins')} onPress={() => navigation.navigate('NewCoin')} />
    </View>
  );
};
