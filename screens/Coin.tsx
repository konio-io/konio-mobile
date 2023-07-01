import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { CoinRouteProp, OperationsStackNavigationProp } from '../types/navigation';
import type { Theme } from '../types/store';
import { Button, TransactionList, Address, Screen } from '../components';
import { useCoin, useTheme } from '../hooks';
import { Feather } from '@expo/vector-icons';

export default () => {
    const navigation = useNavigation<OperationsStackNavigationProp>();
    const route = useRoute<CoinRouteProp>();
    const walletCoin = useCoin(route.params.contractId);
    const coin = walletCoin.get();
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <Screen>
            <View style={styles.header}>

                <View style={styles.headerContent}>
                    <View style={styles.titleContent}>
                        <Text style={{ ...styles.textTitle, ...styles.textCenter }}>{coin.symbol}</Text>
                        <Address address={coin.contractId} copiable={true} compress={true}/>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <Button
                            style={{ flex: 1 }}
                            title="Send"
                            onPress={() => {
                                navigation.navigate('OperationsStack', {
                                    screen: 'WithdrawStack',
                                    params: {
                                        screen: 'WithdrawTo',
                                        params: {
                                            contractId: route.params.contractId
                                        }
                                    }
                                });
                            }}
                            icon={<Feather name="arrow-up-right" />}
                        />
                        <Button
                            style={{ flex: 1 }}
                            title="Receive"
                            onPress={() => navigation.navigate('OperationsStack', {
                                screen: 'Deposit'
                            })}
                            icon={<Feather name="arrow-down-right" />}
                            type='secondary'
                        />
                    </View>
                </View>

            </View>

            <TransactionList contractId={route.params.contractId} />

        </Screen>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, Border, Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        wrapper: {
            flex: 1,
            backgroundColor: Color.base
        },
        header: {
            height: 170,
            borderBottomWidth: Border.width,
            borderBottomColor: Border.color,
            backgroundColor: Color.base,
            alignItems: 'center',
            justifyContent: 'center',

        },
        headerContent: {
            width: 300,
            rowGap: Spacing.base
        },
        titleContent: {
            alignItems: 'center'
        },
        buttonsContainer: {
            height: 40,
            flexDirection: 'row',
            columnGap: Spacing.base
        }
    });
}