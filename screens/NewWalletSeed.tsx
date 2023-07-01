import { View, StyleSheet } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Text, Button, TextInput, Wrapper, Screen, Copiable, Seed } from '../components';
import { generateSeed, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { useEffect } from 'react';
import { Theme } from '../types/store';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const seed = useHookstate('');
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Border } = theme.vars;

    const next = () => {
        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_account_name'),
            });
        } else {
            navigation.navigate('NewWalletSeedConfirm', { seed: seed.get(), name: name.get() })
        }
    }

    useEffect(() => {
        seed.set(generateSeed());
    },[]);

    return (
        <Screen>
            <Wrapper>
                <Text>{i18n.t('choose_account_name')}</Text>

                <TextInput
                    autoFocus={true}
                    value={name.get()}
                    placeholder={i18n.t('account_name')}
                    onChangeText={(text: string) => name.set(text)} />

                <Text>{i18n.t('save_seed')}</Text>

                <View>
                    <Copiable copy={seed.get()}>
                        <View style={styles.textInputMultiline}>
                            <View style={styles.copyIconContainer}>
                                <Feather name="copy" color={Border.color} />
                            </View>
                            <Seed phrase={seed.get()} />
                        </View>
                    </Copiable>

                    <Button
                        type="secondary"
                        title={i18n.t('generate')}
                        icon={<Feather name="refresh-cw" />}
                        onPress={() => seed.set(generateSeed())} />
                </View>
            </Wrapper>

            <View style={styles.screenFooter}>
                <Button
                    title={i18n.t('next')}
                    icon={<Feather name="arrow-right" />}
                    onPress={next}
                />
            </View>
        </Screen>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        copyIconContainer: { 
            position: 'absolute', 
            right: Spacing.small, 
            bottom: Spacing.small
        }
    });
}
