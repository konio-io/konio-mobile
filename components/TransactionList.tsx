import { FlatList, Linking, View, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS, TRANSACTION_TYPE_DEPOSIT, TRANSACTION_TYPE_WITHDRAW } from '../lib/Constants';
import { useTransactions, useCurrentNetworkId, useTransaction, useTheme, useNetwork, useI18n, useCoin, useCurrentAddress } from '../hooks';
import ActivityIndicator from './ActivityIndicator';
import Text from './Text';
import type { Theme } from '../types/store';
import Button from './Button';
import Copiable from './Copiable';
import Accordion from './Accordion';

export default (props: {
    contractId: string
}) => {

    const transactions = useTransactions(props.contractId);

    return (
        <FlatList
            data={Object.keys(transactions.get())}
            renderItem={({ item }) => <TransactionListItem transactionId={item} contractId={props.contractId}/>}
        />
    );
}

export const TransactionListItem = (props: {
    transactionId: string,
    contractId: string
}) => {

    const transaction = useTransaction(props);
    const currentAddress = useCurrentAddress();
    const coin = useCoin(props.contractId);
    const currentNetworkId = useCurrentNetworkId().get();
    const network = useNetwork(currentNetworkId).get();
    const date = new Date(transaction.timestamp.get()).toLocaleDateString();
    const time = new Date(transaction.timestamp.get()).toLocaleTimeString();
    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = createStyles(theme);
    const i18n = useI18n();
    const type = transaction.from.get() === currentAddress.get() ? TRANSACTION_TYPE_WITHDRAW : TRANSACTION_TYPE_DEPOSIT;

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
                                {transaction.status.get() === TRANSACTION_STATUS_PENDING &&
                                    <ActivityIndicator />
                                }
                                {transaction.status.get() === TRANSACTION_STATUS_SUCCESS &&
                                    <TypeIcon type={type} />
                                }
                                {transaction.status.get() === TRANSACTION_STATUS_ERROR &&
                                    <AntDesign name="warning" size={24} color={Color.warning} />
                                }

                                <Text>{i18n.t(type.toLowerCase())}</Text>
                            </View>

                            <Text>{transaction.get().value} {coin.symbol.get()}</Text>
                        </View>
                    </View>
                )}
            >
                <View style={{ ...styles.rowGapBase, ...styles.paddingHorizontalBase }}>
                    <Copiable copy={transaction.transactionId.get()}>
                        <View>
                            <Text style={styles.textSmall}>TXid <Feather name="copy" size={12} /></Text>
                            <Text>{transaction.transactionId.get()}</Text>
                        </View>
                    </Copiable>
                    <View>
                        <Text style={styles.textSmall}>{i18n.t('status')}</Text>

                        {
                            transaction.status.get() === TRANSACTION_STATUS_SUCCESS &&
                            <Text style={{...styles.text, color: Color.success}}>{i18n.t(`transaction_${transaction.status.get()}`)}</Text>
                        }

                        {
                            transaction.status.get() === TRANSACTION_STATUS_PENDING &&
                            <Text style={{...styles.text, color: Color.warning}}>{transaction.status.get()}</Text>
                        }

                        {
                            transaction.status.get() === TRANSACTION_STATUS_ERROR &&
                            <Text style={{...styles.text, color: Color.error}}>{transaction.status.get()}</Text>
                        }
                        
                    </View>

                    {
                        transaction.note.get() &&
                        <View>
                            <Text style={styles.textSmall}>{i18n.t('note')}</Text>
                            <Text>{transaction.note.get()}</Text>
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
        case TRANSACTION_TYPE_DEPOSIT:
            return <Feather name="arrow-down-right" size={24} color={Color.baseContrast} />
        case TRANSACTION_TYPE_WITHDRAW:
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