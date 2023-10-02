import { View } from "react-native";
import { Wrapper, Screen, Seed, TextInputActionCopy } from "../components"
import { useTheme, useLockState } from "../hooks"
import React, { useEffect } from "react";
import { SecureStore, LockStore } from "../stores";
import { AntDesign } from '@expo/vector-icons';

export default () => {
    const currentSeed = SecureStore.getters.getSeed() ?? '';
    const theme = useTheme();
    const styles = theme.styles;
    const lockState = useLockState();

    useEffect(() => {
        LockStore.actions.lock();
    }, [])

    return (
        <Screen>
            <Wrapper>
                {
                    lockState.get() === false &&
                    <View style={styles.textInputContainer}>
                        <Seed phrase={currentSeed} />
                        <View style={{ ...styles.alignEndColumn }}>
                            <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                                <TextInputActionCopy copy={currentSeed} />
                            </View>
                        </View>
                    </View>
                }
                {
                    lockState.get() === true &&
                    <View style={styles.alignCenterColumn}>
                        <AntDesign name="lock1" size={150} color={theme.vars.Border.color} />
                    </View>
                }
            </Wrapper>
        </Screen>
    );
}