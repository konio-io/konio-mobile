import { Button, Screen, Selector, Wrapper, CoinListItem, Text, TextInput } from "../components"
import { useNavigation, useRoute } from "@react-navigation/native";
import { WithdrawAmountNavigationProp, WithdrawAmountRouteProp } from "../types/navigation";
import { useCoinBalance, useTheme, useI18n, useCurrentKoin, useCoinValue } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { View, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import type { Theme } from "../types/store";
import { showToast } from "../actions";
import { useEffect } from "react";

export default () => {
    const route = useRoute<WithdrawAmountRouteProp>();
    const navigation = useNavigation<WithdrawAmountNavigationProp>();
    const i18n = useI18n();
    const currentKoin = useCurrentKoin();
    const contractId = useHookstate(currentKoin.get());
    const balance = useCoinBalance(contractId.get());
    const value = useCoinValue(contractId.get());

    const amount = useHookstate('');
    const amountUsd = useHookstate('');
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color } = theme.vars;

    useEffect(() => {
        if (route.params.contractId) {
            contractId.set(route.params.contractId);
        }
    }, [route.params]);

    useEffect(() => {
        if (amount.get()) {
            const v = (value.get() * parseFloat(amount.get()))/parseFloat(balance.get());
            if (!isNaN(v)) {
                amountUsd.set(v.toString());
            }
        } else {
            amountUsd.set('');
        }
    }, [amount]);

    const setAmauntPerc = (percent: number) => {
        if (balance.get()) {
            const percAmount = (parseFloat(balance.get()) * percent) / 100;
            amount.set(percAmount.toString());
        }
    };

    const next = () => {
        if (parseFloat(amount.get()) <= 0) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_amount')
            });
            return;
        }

        if (parseFloat(amount.get()) > parseFloat(balance.get())) {
            return;
        }

        navigation.navigate('WithdrawConfirm', {
            contractId: contractId.get(),
            amount: amount.get(),
            to: route.params.to
        });
    };

    const isOutAmount = parseFloat(amount.get()) > parseFloat(balance.get());
    const amountStyle = isOutAmount ?
        {...styles.amount, color: Color.error} :
        styles.amount;

    const amountUsdStyle = isOutAmount ?
        {...styles.text, color: Color.error} :
        styles.text;

    return (
        <Screen>

            <View style={{...styles.flex1, ...styles.paddingBase, ...styles.rowGapSmall}}>
                <Selector onPress={() => navigation.navigate('WithdrawSelectCoin', {
                    selected: contractId.get(), 
                    to: route.params.to
                })}>
                    <View style={styles.coinSelectorContainer}>
                        <CoinListItem contractId={contractId.get()}/>
                    </View>
                </Selector>

                <View style={styles.amountContainer}>
                    <View style={styles.amountInput}>
                        <TextInput
                            autoFocus={true}
                            keyboardType='numeric'
                            value={amount.get().toString()}
                            placeholder={i18n.t('amount')}
                            onChangeText={(v: string) => amount.set(v)}
                            textAlign={'center'}
                            style={amountStyle}
                        />

                        {amountUsd.get() &&
                            <Text style={amountUsdStyle}>{amountUsd.get()} USD</Text>
                        }
                    </View>

                    <View style={styles.percContainer}>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(25)} title={i18n.t('perc_25')} type="secondary" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(50)} title={i18n.t('perc_50')} type="secondary" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(100)} title={i18n.t('perc_100')} type="secondary" />
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('next')}
                    onPress={next}
                    icon={<Feather name="arrow-right" />}
                />
            </View>
        </Screen>
    )
}

const createStyles = (theme: Theme) => {
    const { FontSize, Spacing } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...theme.styles,
        symbol: {
            ...styles.text,
            fontSize: FontSize.large,
        },
        balance: {
            ...styles.text,
            fontSize: FontSize.medium
        },
        amount: {
            ...styles.textInput,
            borderWidth: 0,
            width: '100%',
            fontSize: FontSize.large
        },
        coinSelectorContainer: {
            marginRight: 40, 
            height: 50
        },
        amountContainer: {
            rowGap: Spacing.small
        },
        percContainer: {
            flexDirection: 'row', 
            columnGap: Spacing.small
        },
        amountInput: {
            ...styles.textInput,
            padding: Spacing.small,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });
}