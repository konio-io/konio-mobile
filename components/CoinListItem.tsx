import { useCoin, useCurrentKoin, useI18n, useTheme } from '../hooks';
import type { Theme } from '../types/store';
import CoinBalance from './CoinBalance';
import { Alert, StyleSheet, TouchableHighlight, View } from 'react-native';
import CoinSymbol from './CoinSymbol';
import { deleteCoin, showToast } from '../actions';

export default (props: {
    contractId: string,
    onPress?: Function
}) => {

    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const currentKoin = useCurrentKoin();
    const coin = useCoin(props.contractId);

    const deleteCoinInternal = () => {
        deleteCoin(props.contractId);
        showToast({
            type: 'success',
            text1: i18n.t('coin_deleted', {name: coin.symbol.get()})
        })
    };

    const showAlert = () => {
        Alert.alert(
            '',
            i18n.t('coin_deletion_confirm', {name: coin.symbol.get()}),
            [
                {
                    text: i18n.t('yes'),
                    onPress: () => deleteCoinInternal(),
                },
                {
                    text: i18n.t('cancel'),
                    onPress: () => {},
                    style: 'cancel',
                }
            ]
        );
    };

    return (
        <TouchableHighlight
            onPress={() => {
                if (props.onPress) {
                    props.onPress();
                }
            }}
            onLongPress={() => {
                if (props.contractId !== currentKoin.get()) {
                    showAlert();
                }
            }}
        >
            <View style={styles.coinListItemContainer}>
                <CoinSymbol contractId={props.contractId} />
                <CoinBalance contractId={props.contractId} />
            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        coinListItemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: Spacing.base,
            backgroundColor: Color.base
        }
    });
}