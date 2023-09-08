import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoinRouteProp, HoldingsNavigationProp } from '../types/navigation';
import { Button, TransactionList, Screen, MoreVertical, Text, CoinLogo } from '../components';
import { useCoin, useI18n, useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
    const navigation = useNavigation<HoldingsNavigationProp>();
    const route = useRoute<CoinRouteProp>();
    const coin = useCoin(route.params.contractId);
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    useEffect(() => {
        navigation.setOptions({
            title: coin.symbol.get(),
            headerRight: () => {
                return (
                    <MoreVertical onPress={() => {
                        SheetManager.show('coin', { payload: { contractId: route.params.contractId } });
                    }} />
                )
            }
        });
    }, [coin, navigation]);

    return (
        <Screen>
            <View style={{ ...styles.paddingBase, ...styles.rowGapLarge }}>

                <View style={{ ...styles.directionRow, ...styles.alignSpaceBetweenRow, ...styles.alignCenterColumn }}>
                    <View>
                        {
                            coin.balance.ornull && coin.balance.ornull.get() >= 0 &&
                            <View>
                                {coin.price.ornull &&
                                    <Text style={styles.textXlarge}>
                                        {(coin.balance.ornull.get() * coin.price.ornull.get()).toFixed(2)} USD
                                    </Text>
                                }

                                <Text style={styles.textMedium}>{coin.balance.get()} {coin.symbol.get()}</Text>
                            </View>
                        }
                    </View>

                    <View style={{ ...styles.alignCenterColumn, ...styles.rowGapSmall }}>
                        <CoinLogo size={48} contractId={route.params.contractId} />
                    </View>
                </View>

                {coin.symbol.get() !== 'VHP' &&
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