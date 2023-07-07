import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoinRouteProp, AssetsNavigationProp } from '../types/navigation';
import type { Theme } from '../types/store';
import { Button, TransactionList, Address, Screen, MoreVertical, Text, CoinLogo, Wrapper } from '../components';
import { useCoin, useCoinBalance, useCoinValue, useI18n, useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";
import { DEFAULT_COINS } from '../lib/Constants';

export default () => {
    const navigation = useNavigation<AssetsNavigationProp>();
    const route = useRoute<CoinRouteProp>();
    const walletCoin = useCoin(route.params.contractId);
    const coin = walletCoin.get();
    const theme = useTheme();
    const styles = theme.styles;
    const coinBalance = useCoinBalance(route.params.contractId);
    const coinValue = useCoinValue(route.params.contractId);
    const i18n = useI18n();

    useEffect(() => {
        navigation.setOptions({
            title: coin.symbol,
            headerRight: () => {
                if (!DEFAULT_COINS.includes(coin.symbol)) {
                    return (
                        <MoreVertical onPress={() => {
                            SheetManager.show('coin', { payload: { contractId: route.params.contractId } });
                        }} />
                    )
                }
            }
        });
    }, [walletCoin, navigation]);

    return (
        <Screen>
            <View style={{ ...styles.paddingBase, ...styles.rowGapLarge }}>

                <View style={{ ...styles.directionRow, ...styles.alignSpaceBetweenRow, ...styles.alignCenterColumn }}>
                    <View>
                        <View>
                            <Text style={styles.textXlarge}>${coinValue.get().toFixed(2)}</Text>
                            <Text style={styles.textMedium}>{coinBalance.get()} {walletCoin.symbol.get()}</Text>
                        </View>
                    </View>

                    <View style={{ ...styles.alignCenterColumn, ...styles.rowGapSmall }}>
                        <CoinLogo size={48} contractId={route.params.contractId} />
                        <Address address={coin.contractId} copiable={true} length={3} />
                    </View>
                </View>

                {walletCoin.symbol.get() !== 'VHP' &&
                    <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                        <Button
                            style={{ flex: 1 }}
                            title="Send"
                            onPress={() => {
                                navigation.navigate('Withdraw', {
                                    screen: 'WithdrawTo',
                                    params: {
                                        contractId: route.params.contractId
                                    }
                                });
                            }}
                            icon={<Feather name="arrow-up-right" />}
                        />
                        <Button
                            style={{ flex: 1 }}
                            title="Receive"
                            onPress={() => navigation.navigate('Deposit')}
                            icon={<Feather name="arrow-down-right" />}
                            type='secondary'
                        />
                    </View>
                }
            </View>

            <View style={{ ...styles.paddingBase }}>
                <Text style={styles.sectionTitle}>{i18n.t('transactions')}</Text>
            </View>
            
            <TransactionList contractId={route.params.contractId} />
        </Screen>
    );
}