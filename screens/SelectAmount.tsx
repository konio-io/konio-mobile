import { Button, TextInput, Wrapper, Text, Selector } from "../components"
import { useNavigation } from "@react-navigation/native"
import type { SelectAmountNavigationProp } from "../types/navigation";
import i18n from "../locales";
import { useCoin, useCoinBalance, useTheme, useWithdraw } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { View, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import type { Theme } from "../types/store";
import { setWithdrawAmount, setWithdrawContractId, showToast } from "../actions";

export default () => {
    const navigation = useNavigation<SelectAmountNavigationProp>();

    const withdraw = useWithdraw();
    const contractId = withdraw.contractId;

    const balance = useCoinBalance(contractId.get());
    const coin = useCoin(contractId.get());
    const amount = useHookstate(0);
    const theme = useTheme().get();
    const styles = createStyles(theme);
    const { FontSize, Spacing } = theme.vars;

    const setAmauntPerc = (percent: number) => {
        if (balance.get()) {
            const percAmount = (parseFloat(balance.get()) * percent) / 100;
            amount.set(percAmount);
        }
    };

    const next = () => {
        if (amount.get() <= 0) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_amount')
            });
            return;
        }

        setWithdrawContractId(contractId.get());
        setWithdrawAmount(amount.get());
        navigation.push('ConfirmWithdraw');
    };

    return (
        <Wrapper>

            <View style={{ rowGap: Spacing.large }}>

                <Selector onPress={() => navigation.navigate('SelectCoin')}>
                    <View style={{ padding: Spacing.base, alignItems: 'center' }}>
                        <Text style={{ ...styles.text, fontSize: FontSize.large }}>{coin.symbol.get()}</Text>
                        <Text style={styles.textSmall}>{i18n.t('balance')}</Text>
                        <Text style={styles.balance}>{balance.get()}</Text>
                    </View>
                </Selector>

                <View style={{ rowGap: Spacing.small }}>
                    <TextInput
                        keyboardType='numeric'
                        value={amount.get().toString()}
                        placeholder={i18n.t('amount')}
                        onChangeText={(v: string) => amount.set(parseFloat(v))}
                        textAlign={'center'}
                        style={styles.amount}
                    />

                    <View style={{ flexDirection: 'row', columnGap: Spacing.small }}>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(10)} title={i18n.t('perc_10')} type="secondary" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(20)} title={i18n.t('perc_20')} type="secondary" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(30)} title={i18n.t('perc_30')} type="secondary" />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', columnGap: Spacing.small }}>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(50)} title={i18n.t('perc_50')} type="secondary" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(70)} title={i18n.t('perc_70')} type="secondary" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => setAmauntPerc(100)} title={i18n.t('perc_100')} type="secondary" />
                        </View>
                    </View>
                </View>

                <Button
                    title={i18n.t('next')}
                    onPress={next}
                    icon={<Feather name="arrow-right" />}
                />
            </View>


        </Wrapper>
    )
}

const createStyles = (theme: Theme) => {
    const { FontSize } = theme.vars;
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
            fontSize: FontSize.large
        }
    });
}