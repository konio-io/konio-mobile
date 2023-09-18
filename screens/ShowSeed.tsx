import { View } from "react-native";
import { Wrapper, Screen, Seed, TextInputActionCopy } from "../components"
import { useCurrentSeed, useTheme, useLockState } from "../hooks"
import React, { useEffect } from "react";
import { lock } from "../actions";

export default () => {
    const currentSeed = useCurrentSeed() ?? '';
    const theme = useTheme();
    const styles = theme.styles;
    const lockState = useLockState();

    useEffect(() => {
        lock();
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