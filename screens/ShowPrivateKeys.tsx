import { ScrollView, View } from "react-native";
import { Screen, TextInputActionCopy, Text, AddressListItem } from "../components"
import { useLockState, useTheme } from "../hooks"
import React, { useEffect } from "react";
import { SecureStore, LockStore, AccountStore } from "../stores";
import { AntDesign } from '@expo/vector-icons';

export default () => {
    const theme = useTheme();
    const styles = theme.styles;
    const lockState = useLockState();

    useEffect(() => {
        LockStore.actions.lock();
    }, [])

    return (
        <Screen>
            {
                lockState.get() === false &&
                <ScrollView contentContainerStyle={{ ...styles.paddingBase, ...styles.rowGapMedium }}>
                    {Object.values(SecureStore.state.accounts.get()).map(account =>
                        <PrivateKey key={account.address} address={account.address} privateKey={account.privateKey} />
                    )}
                </ScrollView>
            }
            {
                lockState.get() === true &&
                <View style={{...styles.alignCenterColumn, ...styles.alignCenterRow, flex: 1}}>
                    <AntDesign name="lock1" size={150} color={theme.vars.Border.color} />
                </View>
            }
        </Screen>
    );
}

const PrivateKey = (props: {
    address: string,
    privateKey: string
}) => {
    const account = AccountStore.state.nested(props.address).get();
    const theme = useTheme();
    const styles = theme.styles;

    return (
        <View style={styles.rowGapSmall}>
            <AddressListItem address={props.address} name={account.name} />
            <View style={styles.textInputContainer}>
                <Text>{props.privateKey}</Text>
                <View style={{ ...styles.alignEndColumn }}>
                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                        <TextInputActionCopy copy={props.privateKey} />
                    </View>
                </View>
            </View>
        </View>
    )
}