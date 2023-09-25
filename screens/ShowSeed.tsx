import { View } from "react-native";
import { Wrapper, Screen, Seed, TextInputActionCopy } from "../components"
import { useTheme, useLockState } from "../hooks"
import React, { useEffect } from "react";
import { useStore } from "../stores";

export default () => {
    const { Lock, Secure } = useStore();
    const currentSeed = Secure.getters.getSeed() ?? '';
    const theme = useTheme();
    const styles = theme.styles;
    const lockState = useLockState();

    useEffect(() => {
        Lock.actions.lock();
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
            </Wrapper>
        </Screen>
    );
}