import { Linking, View, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS, TRANSACTION_TYPE_DEPOSIT, TRANSACTION_TYPE_WITHDRAW } from '../lib/Constants';
import { useTheme, useCurrentAccount, useCurrentNetwork } from '../hooks';
import ActivityIndicator from './ActivityIndicator';
import Text from './Text';
import type { Theme } from '../types/ui';
import { Coin, Transaction } from '../types/store';
import Address from './Address';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { rgba } from '../lib/utils';
import { AccountStore, ContactStore } from '../stores';

export default (props: {
    transaction: Transaction,
    coin: Coin
}) => {
    const transaction = props.transaction;
    const currentAccount = useCurrentAccount();
    const currentNetwork = useCurrentNetwork();

    const date = transaction.timestamp ? new Date(transaction.timestamp).toLocaleDateString() : '';
    const time = transaction.timestamp ? new Date(transaction.timestamp).toLocaleTimeString() : '';
    const theme = useTheme();
    const { Color, Spacing } = theme.vars;
    const styles = createStyles(theme);
    const type = transaction.from === currentAccount.address ? TRANSACTION_TYPE_WITHDRAW : TRANSACTION_TYPE_DEPOSIT;

    let name = '';
    if (type === TRANSACTION_TYPE_WITHDRAW) {
        name = ContactStore.state.nested(transaction.to)?.ornull?.name?.get() || AccountStore.state.nested(transaction.to)?.ornull?.name?.get() || '';
    }
    else if (type === TRANSACTION_TYPE_DEPOSIT) {
        name = ContactStore.state.nested(transaction.from)?.ornull?.name?.get() || AccountStore.state.nested(transaction.from)?.ornull?.name?.get() || '';
    }

    const openTransactionLink = () => {
        Linking.openURL(`${currentNetwork.explorer}/${props.transaction.transactionId}`);
    };

    return (
        <TouchableOpacity onPress={openTransactionLink}>
            <View style={{ marginTop: Spacing.medium }}>
                <View style={{ ...styles.directionRow, ...styles.columnGapSmall, alignItems: 'baseline' }}>
                    {transaction.status === TRANSACTION_STATUS_PENDING &&
                        <ActivityIndicator />
                    }

                    {transaction.status === TRANSACTION_STATUS_SUCCESS &&
                        <AntDesign name="checksquareo" size={14} color={rgba(Color.baseContrast, 0.6)} />
                    }

                    {transaction.status === TRANSACTION_STATUS_ERROR &&
                        <AntDesign name="closesquareo" size={14} color={rgba(Color.baseContrast, 0.6)} />
                    }
                    <Text style={styles.textSmall}>{date} {time} </Text>
                </View>


                <View style={styles.descriptionContainer}>

                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                        <TypeIcon type={type} />
                        {name &&
                            <Text>{name}</Text>
                        }
                        {!name &&
                            <Address address={type === TRANSACTION_TYPE_WITHDRAW ? transaction.to : transaction.from} copiable={true} length={5} />
                        }
                    </View>

                    <Text style={{ ...styles.text, color: type === TRANSACTION_TYPE_WITHDRAW ? Color.error : Color.success }}>
                        {type === TRANSACTION_TYPE_WITHDRAW ? '-' : '+'}
                        {transaction.value ? parseFloat(transaction.value).toFixed(2) : ''} {props.coin?.symbol}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const TypeIcon = (props: {
    type: string
}) => {
    const theme = useTheme();
    const { Color } = theme.vars;

    switch (props.type) {
        case TRANSACTION_TYPE_DEPOSIT:
            return <Feather name="arrow-down-right" size={16} color={Color.success} />
        case TRANSACTION_TYPE_WITHDRAW:
            return <Feather name="arrow-up-right" size={16} color={Color.error} />
        default:
            return <AntDesign name="question" size={16} color={Color.info} />
    }
}

const createStyles = (theme: Theme) => {

    return StyleSheet.create({
        ...theme.styles,
        descriptionContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        }
    })
}