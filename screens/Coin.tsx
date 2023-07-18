import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoinRouteProp, AssetsNavigationProp } from '../types/navigation';
import { Button, TransactionList, Screen, MoreVertical, Text, CoinLogo } from '../components';
import { useCoin, useCoinBalance, useCoinValue, useI18n, useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
    const navigation = useNavigation<AssetsNavigationProp>();
    const route = useRoute<CoinRouteProp>();
    const accountCoin = useCoin(route.params.contractId);
    const coin = accountCoin.get();
    const theme = useTheme();
    const styles = theme.styles;
    const coinBalance = useCoinBalance(route.params.contractId);
    const coinValue = useCoinValue(route.params.contractId);
    const i18n = useI18n();

    useEffect(() => {
        navigation.setOptions({
            title: coin.symbol,
            headerRight: () => {
                return (
                    <MoreVertical onPress={() => {
                        SheetManager.show('coin', { payload: { contractId: route.params.contractId } });
                    }} />
                )
            }
        });
    }, [accountCoin, navigation]);

    return (
        <Screen>
            <View style={{ ...styles.paddingBase, ...styles.rowGapLarge }}>

                <View style={{ ...styles.directionRow, ...styles.alignSpaceBetweenRow, ...styles.alignCenterColumn }}>
                    <View>
                        <View>
                            <Text style={styles.textXlarge}>${coinValue.get() && coinValue.get().toFixed(2)}</Text>
                            <Text style={styles.textMedium}>{coinBalance.get()} {accountCoin.symbol.get()}</Text>
                        </View>
                    </View>

                    <View style={{ ...styles.alignCenterColumn, ...styles.rowGapSmall }}>
                        <CoinLogo size={48} contractId={route.params.contractId} />
                    </View>
                </View>

                {accountCoin.symbol.get() !== 'VHP' &&
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

            {
                coin.transactions.length > 0 &&
                <View style={{ ...styles.paddingBase }}>
                    <Text style={styles.sectionTitle}>{i18n.t('transactions')}</Text>
                </View>
            }

            <TransactionList contractId={route.params.contractId} />
        </Screen>
    );
}