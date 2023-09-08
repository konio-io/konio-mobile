import { TouchableHighlight, View } from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useI18n, useAccount, useAccountValue } from '../hooks';
import { Screen, DrawerToggler, MoreVertical, Text, Address, ManaBar } from '../components';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect } from 'react';
import AssetsCoins from '../components/AssetsCoins';
import AssetsNfts from '../components/AssetsNfts';

const CATEGORY_COINS = 'coins';
const CATEGORY_NFTS = 'nfts';

export default () => {

  const currentAddress = useCurrentAddress();
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const i18n = useI18n();
  const account = useAccount(currentAddress.get());
  const category = useHookstate(CATEGORY_COINS);
  const total = useAccountValue();

  useEffect(() => {
    navigation.setOptions({
      title: account.name.get(),
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerLeft: () => (<DrawerToggler />),
      headerRight: () => (<MoreVertical onPress={() => SheetManager.show('account', { payload: { address: currentAddress.get() } })} />),
      headerTitle: () => (
        <View style={styles.alignCenterColumn}>
          <Text style={styles.textMedium}>{account.name.get()}</Text>
          <Address address={currentAddress.get()} copiable={true} />
        </View>
      )
    });
  }, [navigation]);

  return (
    <Screen>
      <View style={{ ...styles.rowGapBase }}>
        <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.alignSpaceBetweenRow }}>
          <View>
            <Text style={styles.textXlarge}>{total.get().toFixed(2)} USD</Text>
            <Text style={styles.textSmall}>{i18n.t('total_balance')}</Text>
          </View>

          <View>
            <ManaBar />
          </View>
        </View>
      </View>

      <Toggler selected={category} />

      {
        category.get() === CATEGORY_COINS &&
        <AssetsCoins></AssetsCoins>
      }

      {
        category.get() === CATEGORY_NFTS &&
        <AssetsNfts></AssetsNfts>
      }

    </Screen>
  );
}

const Toggler = (props: {
  selected: State<string>
}) => {

  const theme = useTheme();
  const styles = theme.styles;
  const { Color, Border } = theme.vars;

  return (
    <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.alignCenterRow }}>

      <TouchableHighlight onPress={() => props.selected.set(CATEGORY_COINS)} style={{
        borderTopLeftRadius: Border.radius,
        borderBottomLeftRadius: Border.radius,
        width: 100
      }}>
        <View style={{
          ...styles.paddingSmall,
          ...styles.alignCenterColumn,
          borderTopLeftRadius: Border.radius,
          borderBottomLeftRadius: Border.radius,
          backgroundColor: props.selected.get() === CATEGORY_COINS ? Color.primary : Border.color,
        }}>
          <Text style={{
            ...styles.text,
            color: props.selected.get() === CATEGORY_COINS ? Color.primaryContrast : Color.baseContrast,
          }}>COINS</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight onPress={() => props.selected.set(CATEGORY_NFTS)} style={{
        borderTopRightRadius: Border.radius,
        borderBottomRightRadius: Border.radius,
        width: 100,
      }}>
        <View style={{
          ...styles.paddingSmall,
          ...styles.alignCenterColumn,
          backgroundColor: props.selected.get() === CATEGORY_NFTS ? Color.primary : Border.color,
          borderTopRightRadius: Border.radius,
          borderBottomRightRadius: Border.radius
        }}>
          <Text style={{
            ...styles.text,
            color: props.selected.get() === CATEGORY_NFTS ? Color.primaryContrast : Color.baseContrast,
          }}>NFTs</Text>
        </View>
      </TouchableHighlight>

    </View>
  );
}