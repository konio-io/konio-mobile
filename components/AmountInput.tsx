import { Button, Text, TextInput } from '../components';
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useCoin, useI18n, useTheme } from '../hooks';
import { useEffect, useState } from "react";
import { Theme } from '../types/store';
import TextInputContainer from './TextInputContainer';
import ActionSheet, { SheetManager, SheetProps, registerSheet } from 'react-native-actions-sheet';

export default (props: {
    value?: number,
    contractId: string,
    onChange?: Function,
    opened?: boolean
}) => {
    const coin = useCoin(props.contractId);
    const [usd, setUsd] = useState(0)
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    useEffect(() => {
        if (coin?.price && props.value) {
            const price = coin.price ?? 0;
            setUsd(props.value * price);
        }
    }, [props.value, coin]);

    useEffect(() => {
        if (props.opened === true) {
            //_select();
        }
    }, [props.opened])

    const _select = async () => {
        const data: any = await SheetManager.show("amount", {
            payload: {
                amount: props.value,
                contractId: props.contractId
            }
        });

        if (data?.amount && props.onChange) {
            props.onChange(data.amount);
        }
    }

    return (
        <TextInputContainer note={i18n.t('amount')}>
            <TouchableWithoutFeedback
                onPress={() => _select()}
                style={{ minHeight: 60 }}
                containerStyle={{ flexGrow: 1 }}
            >
                <View>
                    <Text style={{...styles.textMedium, ...styles.textBold}}>{props.value}</Text>
                    <Text>~ {usd.toFixed(2)} USD</Text>
                </View>
            </TouchableWithoutFeedback>
        </TextInputContainer>
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
            width: '100%'
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

const ActionSheetAmount = (props: SheetProps<{ amount: number, contractId: string }>) => {
    const theme = useTheme();
    const i18n = useI18n();
    const styles = createStyles(theme);
    const { Color } = theme.vars;
    const coin = useCoin(props.payload?.contractId ?? '');
    const [amount, setAmount] = useState(props.payload?.amount.toString() ?? '');
    const [amountUsd, setAmountUsd] = useState('');

    useEffect(() => {
        if (amount) {
            const v = (price * parseFloat(amount));
            if (!isNaN(v)) {
                setAmountUsd(v.toString());
            }
        } else {
            setAmountUsd('');
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

    const _close = () => {
        SheetManager.hide(props.sheetId);
    }

    return (
        <ActionSheet
            id={props.sheetId}
            closeOnTouchBackdrop={false}
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
                    {amountUsd &&
                        <Text style={amountUsdStyle}>{amountUsd} USD</Text>
                    }
                </View>
            </View>

            <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                <Button style={{flex: 1}} onPress={() => _close()} type="secondary" title={i18n.t('cancel')} />
                <Button style={{flex: 1}} title={i18n.t('confirm')} onPress={() => _confirm()}/>
            </View>
            
        </ActionSheet>
    );
}
registerSheet('amount', ActionSheetAmount);