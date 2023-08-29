import { FlatList, Linking, View, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS } from '../lib/Constants';
import { useCoinTransactions, useCurrentNetworkId, useTransaction, useTheme, useNetwork, useI18n } from '../hooks';
import { UserStore } from '../stores';
import ActivityIndicator from './ActivityIndicator';
import Text from './Text';
import type { Theme } from '../types/store';
import Button from './Button';
import Copiable from './Copiable';
import Accordion from './Accordion';

export default (props: {
    contractId: string
}) => {

    const transactions = useCoinTransactions(props.contractId);

    return (
        <FlatList
            data={transactions.get().map(t => t.transactionId)}
            renderItem={({ item }) => <TransactionListItem transactionId={item} />}
        />
    );
}

export const TransactionListItem = (props: {
    transactionId: string,
}) => {

    const transaction = useTransaction(props.transactionId).get();
    const coin = UserStore.coins[transaction.contractId].get();
    const currentNetworkId = useCurrentNetworkId().get();
    const network = useNetwork(currentNetworkId).get();
    const date = new Date(transaction.timestamp).toLocaleDateString();
    const time = new Date(transaction.timestamp).toLocaleTimeString();
    const theme = useTheme();
    const { Color, Spacing } = theme.vars;
    const styles = createStyles(theme);
    const i18n = useI18n();

    const openTransactionLink = () => {
        Linking.openURL(`${network.explorer}/${props.transactionId}`);
    };

    return (
        <View style={styles.paddingVerticalSmall}>
            <Accordion
                header={(
                    <View style={{ ...styles.paddingHorizontalBase }}>
                        <Text style={styles.textSmall}>{date} {time}</Text>
                        <View style={styles.descriptionContainer}>

                            <View style={styles.statusIconContainer}>
                                {transaction.status === TRANSACTION_STATUS_PENDING &&
                                    <ActivityIndicator />
                                }
                                {transaction.status === TRANSACTION_STATUS_SUCCESS &&
                                    <TypeIcon type={transaction.type} />
                                }
                                {transaction.status === TRANSACTION_STATUS_ERROR &&
                                    <AntDesign name="warning" size={24} color={Color.warning} />
                                }

                                <Text>{i18n.t(transaction.type.toLowerCase())}</Text>
                            </View>

                            <Text>{transaction.value} {coin.symbol}</Text>
                        </View>
                    </View>
                )}
            >
                <View style={{ ...styles.rowGapBase, ...styles.paddingHorizontalBase }}>
                    <Copiable copy={transaction.transactionId}>
                        <View>
                            <Text style={styles.textSmall}>TXid <Feather name="copy" size={12} /></Text>
                            <Text>{transaction.transactionId}</Text>
                        </View>
                    </Copiable>
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('type')}</Text>
                        <Text>{transaction.type}</Text>
                    </View>
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('status')}</Text>
                        <Text>{transaction.status}</Text>
                    </View>

                    {
                        transaction.note &&
                        <View>
                            <Text style={styles.textSmall}>{i18n.t('note')}</Text>
                            <Text>{transaction.note}</Text>
                        </View>
                    }

                    <Button
                        title={i18n.t('open_explorer')}
                        onPress={openTransactionLink}
                        type='secondary'
                        icon={<Feather name="external-link" />}
                    />
                </View>
            </Accordion>
        </View>
    );
}

const TypeIcon = (props: {
    type: string
}) => {

    const theme = useTheme();
    const { Color } = theme.vars;

    switch (props.type) {
        case 'SWAP':
            return <AntDesign name="swap" size={24} color={Color.baseContrast} />
        case 'DEPOSIT':
            return <Feather name="arrow-down-right" size={24} color={Color.baseContrast} />
        case 'WITHDRAW':
            return <Feather name="arrow-up-right" size={24} color={Color.baseContrast} />
        default:
            return <AntDesign name="question" size={24} color={Color.baseContrast} />
    }
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        descriptionContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        statusIconContainer: {
            flexDirection: 'row',
            columnGap: Spacing.small
        }
    })
}