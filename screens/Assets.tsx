import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useI18n, useAccountValue, useCurrentAddress, useAccount } from '../hooks';
import { Screen, DrawerToggler, MoreVertical, Text, Address, ManaBar } from '../components';
import { AssetsNavigationProp, } from '../types/navigation';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect, useState } from 'react';
import AssetsCoins from '../components/AssetsCoins';
import AssetsNfts from '../components/AssetsNfts';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';

export default () => {
  const navigation = useNavigation<AssetsNavigationProp>();
  const theme = useTheme();
  const styles = theme.styles;
  const currentAddressState = useCurrentAddress();
  const account = useAccount(currentAddressState);
  
  useEffect(() => {
    navigation.setOptions({
      title: account?.name,
      headerShadowVisible: false,
      headerTitleAlign: 'center',
      headerLeft: () => (<DrawerToggler />),
      headerRight: () => (<MoreVertical onPress={() => SheetManager.show('account', { payload: { address: currentAddressState } })} />),
      headerTitle: () => (
        <View style={styles.alignCenterColumn}>
          <Text style={styles.textMedium}>{account?.name}</Text>
          <Address address={currentAddressState} copiable={true} />
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