import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useI18n, useAccountValue, useCurrentAccount } from '../hooks';
import { Screen, DrawerToggler, MoreVertical, Text, Address, ManaBar } from '../components';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect, useState } from 'react';
import AssetsCoins from '../components/AssetsCoins';
import AssetsNfts from '../components/AssetsNfts';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';
import SettingStore from '../stores/SettingStore';
import { useHookstate } from '@hookstate/core';

export default () => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;

  const currentAddressState = useHookstate(SettingStore.state.currentAccountId);
  const account = useCurrentAccount();
  
  useEffect(() => {
    navigation.setOptions({
      title: account?.name,
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerLeft: () => (<DrawerToggler />),
      headerRight: () => (<MoreVertical onPress={() => SheetManager.show('account', { payload: { accountId: account.id } })} />),
      headerTitle: () => (
        <View style={styles.alignCenterColumn}>
          <Text style={styles.textMedium}>{account?.name}</Text>
          <Address address={account.address} copiable={true} />
        </View>
      )
    });
  }, [navigation, currentAddressState]);

  return (
    <Screen>
      <View style={{ ...styles.rowGapBase }}>
        <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.alignSpaceBetweenRow }}>
          <Summary />

          <View>
            <ManaBar />
          </View>
        </View>
      </View>

      <Body />

    </Screen>
  );
}

const Body = () => {
  const [category, setCategory] = useState(CATEGORY_COINS);

  return (
    <View>
      <AssetToggler selected={category} onChange={(value: string) => setCategory(value)} />
      {
        category === CATEGORY_COINS &&
        <AssetsCoins/>
      }
      {
        category === CATEGORY_NFTS &&
        <AssetsNfts/>
      }
    </View>
  );
}

const Summary = () => {
  const theme = useTheme();
  const i18n = useI18n();
  const styles = theme.styles;
  const total = useAccountValue();

  return (
    <View>
      <Text style={styles.textXlarge}>{total.toFixed(2)} USD</Text>
      <Text style={styles.textSmall}>{i18n.t('total_balance')}</Text>
    </View>
  )
}