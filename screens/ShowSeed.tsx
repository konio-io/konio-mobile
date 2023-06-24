import { View } from "react-native";
import { Wrapper, Seed, Copiable } from "../components"
import { useCurrentSeed, useLocker, useTheme, useI18n } from "../hooks"
import React from "react";
import { Feather } from '@expo/vector-icons';

export default () => {
    const currentSeed = useCurrentSeed().get() ?? '';
    const theme = useTheme();
    const styles = theme.styles;
    const { Border, Spacing } = theme.vars;

    useLocker({key: 'show_seed', initialValue: true});

    return (
        <Wrapper>
            <Copiable copy={currentSeed}>
                <View style={styles.textInputMultiline}>
                    <View style={{ position: 'absolute', right: Spacing.small, bottom: Spacing.small }}>
                        <Feather name="copy" color={Border.color} />
                    </View>
                    <Seed phrase={currentSeed} />
                </View>
            </Copiable>
        </Wrapper>
    );
}