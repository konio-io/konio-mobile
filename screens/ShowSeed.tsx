import { View } from "react-native";
import { Wrapper, Button, Seed, Copiable } from "../components"
import { useCurrentSeed, useLocker, useTheme } from "../hooks"
import React from "react";
import { Feather } from '@expo/vector-icons';
import i18n from "../locales";
import { useNavigation } from "@react-navigation/native";
import { UnlockNavigationProp } from "../types/navigation";

export default () => {
    const navigation = useNavigation<UnlockNavigationProp>();
    const key = 'show_seed';
    const locker = useLocker(key);
    const currentSeed = useCurrentSeed().get() ?? '';
    const theme = useTheme().get();
    const styles = theme.styles;
    const { Border, Spacing } = theme.vars;

    return (
        <Wrapper>
            {!locker.get() &&
                <Copiable copy={currentSeed}>
                    <View style={styles.textInputMultiline}>
                        <View style={{ position: 'absolute', right: Spacing.small, bottom: Spacing.small }}>
                            <Feather name="copy" color={Border.color} />
                        </View>
                        <Seed phrase={currentSeed} />
                    </View>
                </Copiable>
            }

            {locker.get() &&
                <Button 
                    title={i18n.t('show')}
                    icon={<Feather name="eye"/>} 
                    onPress={() => navigation.navigate('Unlock', { key })}
                />
            }
        </Wrapper>
    );
}