import { View } from "react-native";
import { Wrapper, Screen, Seed, TextInputActionCopy } from "../components"
import { useCurrentSeed, useTheme } from "../hooks"
import React, { useEffect } from "react";
import { lock } from "../actions";

export default () => {
    const currentSeed = useCurrentSeed().get() ?? '';
    const theme = useTheme();
    const styles = theme.styles;

    useEffect(() => {
        lock();
    }, [])

    return (
        <Screen>
            <Wrapper>

                <View style={styles.textInputContainer}>
                    <Seed phrase={currentSeed} />
                    <View style={{ ...styles.alignEndColumn }}>
                        <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                            <TextInputActionCopy copy={currentSeed} />
                        </View>
                    </View>
                </View>

            </Wrapper>
        </Screen>
    );
}