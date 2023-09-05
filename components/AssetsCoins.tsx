import { TouchableHighlight, View } from 'react-native';
import { State } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useI18n, useCurrentKoin } from '../hooks';
import { CoinList, ManaBar, CoinListItem, Screen, Link } from '.';
import { AssetsNavigationProp, } from '../types/navigation';
import Loading from '../screens/Loading';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
  const currentAddress = useCurrentAddress();
  const currentAddressOrNull: State<string> | null = currentAddress.ornull;
  if (!currentAddressOrNull) {
    return <Loading />
  }

  const theme = useTheme();
  const styles = theme.styles;

  return (
    <Screen>
      <View style={{ ...styles.rowGapBase }}>
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
  const navigation = useNavigation<AssetsNavigationProp>();
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
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const i18n = useI18n();

  return (
    <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
      <Link text={i18n.t('add_more_coins')} onPress={() => navigation.navigate('NewCoin')} />
    </View>
  );
};
