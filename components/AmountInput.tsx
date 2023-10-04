import { Button, Text, TextInput, ActionSheet } from '../components';
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useI18n, useTheme } from '../hooks';
import { useEffect, useState } from "react";
import { Theme } from '../types/ui';
import TextInputContainer from './TextInputContainer';
import { SheetManager, SheetProps, registerSheet } from 'react-native-actions-sheet';
import { CoinStore } from '../stores';

export default (props: {
    value?: number,
    coinId: string,
    onChange?: Function,
    opened?: boolean
}) => {
    const [usd, setUsd] = useState(0);
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    useEffect(() => {
        const coin = CoinStore.state.nested(props.coinId);
        if (coin.price.ornull && props.value) {
            const price = coin.price?.ornull?.get() ?? 0;
            setUsd(props.value * price);
        }
    }, [props.value, props.coinId]);

    useEffect(() => {
        if (props.opened === true) {
            _select();
        }
    }, [props.opened])

    const _select = async () => {
        const data: any = await SheetManager.show("amount", {
            payload: {
                amount: props.value,
                coinId: props.coinId
            }
        });

        if (data?.amount && props.onChange) {
            props.onChange(data.amount);
        }
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => _select()}
            style={{ minHeight: 60 }}
        >
            <View>
                <TextInputContainer note={i18n.t('amount')}>

                    <View style={{minHeight: 60}}>
                        <Text style={{ ...styles.textMedium, ...styles.textBold }}>{props.value}</Text>
                        <Text>~ {usd.toFixed(2)} USD</Text>
                    </View>

                </TextInputContainer>
            </View>
        </TouchableWithoutFeedback>
    )
}


const createStyles = (theme: Theme) => {
    const { FontSize, Spacing } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...theme.styles,
        balance: {
            ...styles.text,
            fontSize: FontSize.medium
        },
        amount: {
            ...styles.textInput,
            borderWidth: 0,
            width: '100%',
        },
        coinSelectorContainer: {
            marginRight: 40,
            height: 50
        },
        percContainer: {
            flexDirection: 'row',
            columnGap: Spacing.small,
            padding: Spacing.base
        }
    });
}

const ActionSheetAmount = (props: SheetProps<{ amount: number, coinId: string }>) => {
    const theme = useTheme();
    const i18n = useI18n();
    const styles = createStyles(theme);
    const { Color } = theme.vars;
    const coin = CoinStore.state.nested(props.payload?.coinId ?? '').get();
    const [amount, setAmount] = useState(props.payload?.amount.toString() ?? '');
    const [amountUsd, setAmountUsd] = useState(0);

    useEffect(() => {
        if (amount) {
            const v = (price * parseFloat(amount));
            if (!isNaN(v)) {
                setAmountUsd(v);
            }
        } else {
            setAmountUsd(0);
        }
    }, [amount]);

    if (!coin) {
        return <></>;
    }

    const balance = coin.balance ?? 0;
    const price = coin.price ?? 0;
    const isOutAmount = parseFloat(amount) > balance;
    const amountStyle = isOutAmount ?
        { ...styles.amount, color: Color.error } :
        styles.amount;

    const amountUsdStyle = isOutAmount ?
        { ...styles.text, color: Color.error } :
        styles.text;

    const _setAmauntPerc = (percent: number) => {
        if (balance) {
            const percAmount = (balance * percent) / 100;
            setAmount(percAmount.toString());
        }
    };

    const _confirm = () => {
        if (!isOutAmount && amount) {
            const payload = { amount: parseFloat(amount) }
            SheetManager.hide(props.sheetId, { payload });
        }
    }

    return (
        <ActionSheet
            id={props.sheetId}
            containerStyle={{ ...theme.styles.paddingBase, ...theme.styles.rowGapMedium }}
        >
            <View style={styles.rowGapSmall}>
                <TextInput
                    autoFocus={true}
                    keyboardType='numeric'
                    value={amount.toString()}
                    placeholder={i18n.t('amount')}
                    onChangeText={(v: string) => setAmount(v)}
                    textAlign={'center'}
                    style={amountStyle}
                    actions={(
                        <View style={styles.percContainer}>
                            <View style={{ flex: 1 }}>
                                <Button onPress={() => _setAmauntPerc(25)} title={i18n.t('perc_25')} type="secondary" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Button onPress={() => _setAmauntPerc(50)} title={i18n.t('perc_50')} type="secondary" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Button onPress={() => _setAmauntPerc(100)} title={i18n.t('perc_100')} type="secondary" />
                            </View>
                        </View>
                    )}
                />

                <View style={{ ...styles.alignCenterColumn, height: 20 }}>
                    {amountUsd !== undefined &&
                        <Text style={amountUsdStyle}>{amountUsd.toFixed(2)} USD</Text>
                    }
                </View>
            </View>

            <Button title={i18n.t('confirm')} onPress={() => _confirm()} />

        </ActionSheet>
    );
}
registerSheet('amount', ActionSheetAmount);