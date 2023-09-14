import { useHookstate } from '@hookstate/core';
import { Button, Text, TextInput } from '../components';
import { View, StyleSheet } from "react-native";
import { useCoin, useI18n, useTheme } from '../hooks';
import { useEffect } from "react";
import { Theme } from '../types/store';
import TextInputContainer from './TextInputContainer';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActionSheet, { SheetManager, SheetProps, registerSheet } from 'react-native-actions-sheet';

export default (props: {
    value?: number,
    contractId: string,
    onChange?: Function,
    opened?: boolean
}) => {

    const value = useHookstate(0);
    const contractId = useHookstate('');
    const coin = useCoin(contractId.get());
    const usd = useHookstate(0)
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const opened = useHookstate(false);

    useEffect(() => {
        value.set(props.value ?? 0);
    }, [props.value]);

    useEffect(() => {
        contractId.set(props.contractId);
    }, [props.contractId]);

    useEffect(() => {
        const price = coin.price?.get() ?? 0;
        usd.set(value.get() * price);
    }, [value, coin.price])

    useEffect(() => {
        opened.set(props.opened ?? false);
    }, [props.opened])

    useEffect(() => {
        if (opened.get() == true) {
            _select().then(() => {
                opened.set(false);
            });
        }
    }, [opened])

    const _select = async () => {
        const data: any = await SheetManager.show("amount", {
            payload: {
                amount: value.get(),
                contractId: contractId.get()
            }
        });

        if (data) {
            value.set(data.amount);
            _onChange();
        }
    }

    const _onChange = () => {
        if (props.onChange) {
            props.onChange(value.get());
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
                    <Text style={{...styles.textMedium, ...styles.textBold}}>{value.get()}</Text>
                    <Text>~ {usd.get().toFixed(2)} USD</Text>
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
    const balance = coin.balance.get() ?? 0;
    const price = coin.price.get() ?? 0;
    const amount = useHookstate(props.payload?.amount.toString() ?? '');
    const amountUsd = useHookstate('');

    useEffect(() => {
        if (amount.get()) {
            const v = (price * parseFloat(amount.get()));
            if (!isNaN(v)) {
                amountUsd.set(v.toString());
            }
        } else {
            amountUsd.set('');
        }
    }, [amount]);

    const isOutAmount = parseFloat(amount.get()) > balance;
    const amountStyle = isOutAmount ?
        { ...styles.amount, color: Color.error } :
        styles.amount;

    const amountUsdStyle = isOutAmount ?
        { ...styles.text, color: Color.error } :
        styles.text;

    const _setAmauntPerc = (percent: number) => {
        if (balance) {
            const percAmount = (balance * percent) / 100;
            amount.set(percAmount.toString());
        }
    };

    const _confirm = () => {
        if (!isOutAmount && amount.get()) {
            const payload = { amount: parseFloat(amount.get()) }
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
                    value={amount.get().toString()}
                    placeholder={i18n.t('amount')}
                    onChangeText={(v: string) => amount.set(v)}
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
                    {amountUsd.get() &&
                        <Text style={amountUsdStyle}>{amountUsd.get()} USD</Text>
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