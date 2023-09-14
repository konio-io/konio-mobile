import { View } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import { useCurrentAddress, useTheme, useI18n, useAccount, useAccountValue } from '../hooks';
import { Screen, DrawerToggler, MoreVertical, Text, Address, ManaBar } from '../components';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect } from 'react';
import AssetsCoins from '../components/AssetsCoins';
import AssetsNfts from '../components/AssetsNfts';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';

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
  }, [navigation, currentAddress]);

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

      <AssetToggler selected={category} />

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

