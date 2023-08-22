import { ScrollView, View } from "react-native";
import { Screen, TextInputActionCopy, Text, AddressListItem } from "../components"
import { useAccount, useTheme } from "../hooks"
import React, { useEffect } from "react";
import { lock } from "../actions";
import { EncryptedStore } from "../stores";

export default () => {
    const encryptedStore = EncryptedStore;
    const theme = useTheme();
    const styles = theme.styles;

    useEffect(() => {
        lock();
    }, [])

    return (
        <Screen>
            <ScrollView contentContainerStyle={{ ...styles.paddingBase, ...styles.rowGapMedium }}>
                {Object.values(encryptedStore.accounts.get()).map(account =>
                    <PrivateKey address={account.address} privateKey={account.privateKey} />
                )}
            </ScrollView>
        </Screen>
    );
}

const PrivateKey = (props: {
    address: string,
    privateKey: string
}) => {
    const account = useAccount(props.address).get();
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