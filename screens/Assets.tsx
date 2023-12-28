import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useAccountValue, useCurrentAccount } from '../hooks';
import { Screen, DrawerToggler, MoreVertical, Text, ManaBar } from '../components';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect, useState } from 'react';
import AssetsCoins from '../components/AssetsCoins';
import AssetsNfts from '../components/AssetsNfts';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';
import SettingStore from '../stores/SettingStore';
import { useHookstate } from '@hookstate/core';
import { formatCurrency } from '../lib/utils';

export default () => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const { Spacing } = theme.vars;

  const currentAddressState = useHookstate(SettingStore.state.currentAccountId);
  const account = useCurrentAccount();

  useEffect(() => {
    navigation.setOptions({
      title: account?.name,
      headerTitleAlign: 'center',
      headerLeft: () => (<DrawerToggler />),
      headerRight: () => (
        <MoreVertical
          onPress={() => SheetManager.show('account', { payload: { accountId: account.id } })}
        />),
      headerTitle: () => (
        <View style={styles.alignCenterColumn}>
          <Text style={styles.textMedium}>{account?.name}</Text>
        </View>
      )
    });
  }, [navigation, currentAddressState, theme]);

  return (
    <Screen>
      <View style={{ paddingVertical: Spacing.base, ...styles.alignCenterColumn }}>
        <Summary />
        <ManaBar />
      </View>

      <Body />

    </Screen>
  );
}

const Body = () => {
  const [category, setCategory] = useState(CATEGORY_COINS);
  const { vars } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <View style={{marginBottom: vars.Spacing.base}}>
        <AssetToggler selected={category} onChange={(value: string) => setCategory(value)} />
      </View>

      {
        category === CATEGORY_COINS &&
        <AssetsCoins />
      }
      {
        category === CATEGORY_NFTS &&
        <AssetsNfts />
      }

    </View>
  );
}

const Summary = () => {
  const theme = useTheme();
  const styles = theme.styles;
  const total = useAccountValue();

  return (
    <Text style={{ ...styles.textXlarge, lineHeight: 30 }}>{formatCurrency(total)} USD</Text>
  )
}