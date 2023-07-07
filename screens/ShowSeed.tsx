import { View } from "react-native";
import { Wrapper, Screen, Seed, TextInputActionCopy } from "../components"
import { useCurrentSeed, useLocker, useTheme } from "../hooks"
import React from "react";

export default () => {
    const currentSeed = useCurrentSeed().get() ?? '';
    const theme = useTheme();
    const styles = theme.styles;
    const { Border, Spacing } = theme.vars;

    useLocker({ key: 'show_seed', initialValue: true });

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