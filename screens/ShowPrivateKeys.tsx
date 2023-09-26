import { ScrollView, View } from "react-native";
import { Screen, TextInputActionCopy, Text, AddressListItem } from "../components"
import { useLockState, useTheme } from "../hooks"
import React, { useEffect } from "react";
import { SecureStore, LockStore, AccountStore } from "../stores";

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
        <View>
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