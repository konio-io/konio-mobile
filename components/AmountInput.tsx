import { View, TouchableHighlight, StyleSheet } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { useCoinBalance, useTheme } from '../hooks';
import type { Theme } from '../types/store';
import TextInput from './TextInput';
import Text from './Text';

export default (props: {
    contractId: string,
    onChange?: Function
}) => {

    const amount = useHookstate('');
    const balance = useCoinBalance(props.contractId);
    const theme = useTheme().get();
    const styles = createStyles(theme);

    const setAmauntPerc = (percent: number) => {
        if (balance.get()) {
            const percAmount = (parseFloat(balance.get()) * percent)/100;
            amount.set(percAmount.toString());
            if (props.onChange) {
                props.onChange(amount.get());
            }
        }
    }

    return (
        <View>
            <TextInput
                keyboardType='numeric'
                value={amount.get().toString()}
                placeholder='Amount'
                onChangeText={(v: string) => {
                    amount.set(v);
                    if (props.onChange) {
                        props.onChange(v);
                    }
                }}
            />

            <View style={styles.buttonPercentListContainer}>
                <ButtonPercent onPress={() => setAmauntPerc(10)} title="10%" />
                <ButtonPercent onPress={() => setAmauntPerc(20)} title="20%" />
                <ButtonPercent onPress={() => setAmauntPerc(50)} title="50%" />
                <ButtonPercent onPress={() => setAmauntPerc(70)} title="70%" />
                <ButtonPercent onPress={() => setAmauntPerc(100)} title="100%" />
            </View>
        </View>
    )
}

const ButtonPercent = (props: {
    title: string,
    onPress: Function
}) => {

    const theme = useTheme().get();
    const styles = createStyles(theme);

    return (
        <View style={{ flex: 1 }}>
            <TouchableHighlight onPress={() => props.onPress()}>
                <View style={styles.buttonPercentContainer}>
                    <Text style={styles.buttonPercentText}>
                        {props.title.toUpperCase()}
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const createStyles = (theme : Theme ) => {
    const { Border, Color, FontFamily } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        buttonPercentText: {
            textAlign: 'center',
            fontFamily: FontFamily.sans,
            color: Color.primary
        },
        buttonPercentContainer: {
            backgroundColor: Color.base,
        },
        buttonPercentListContainer: {
            flexDirection: 'row',
            borderColor: Color.primary,
            borderRadius: Border.radius,
            borderWidth: 2,
            backgroundColor: Color.primary,
            columnGap: 1
        }
    });
}