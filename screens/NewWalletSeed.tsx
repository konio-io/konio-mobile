import { View, StyleSheet } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Text, Button, TextInput, Wrapper, Copiable, Seed } from '../components';
import { generateSeed, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import type { Theme } from '../types/store';
import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const seed = useHookstate('');
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Border, Spacing } = theme.vars;

    const next = () => {
        if (!name.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_account_name'),
            });
        } else {
            navigation.push('NewWalletSeedConfirm', { seed: seed.get(), name: name.get() })
        }
    }

    return (
        <Wrapper>

            <Text>{i18n.t('choose_account_name')}</Text>

            <TextInput
                value={name.get()}
                placeholder={i18n.t('account_name')}
                onChangeText={(text: string) => name.set(text)} />

            <Text>{i18n.t('save_seed')}</Text>

            <Copiable copy={seed.get()}>
                <View style={styles.textInputMultiline}>
                    <View style={{position: 'absolute', right: Spacing.small, bottom: Spacing.small}}>
                        <Feather name="copy" color={Border.color} />
                    </View>
                    <Seed phrase={seed.get()} />
                </View>
            </Copiable>

            <View style={styles.buttonContainer}>
                <View style={{ flex: 1 }}>
                    <Button
                        type="secondary"
                        title={i18n.t('generate')}
                        icon={<Feather name="refresh-cw" />}
                        onPress={() => seed.set(generateSeed())} />
                </View>

                <View style={{ flex: 1 }}>
                    <Button
                        title={i18n.t('next')}
                        icon={<Feather name="arrow-right" />}
                        onPress={next}
                    />
                </View>
            </View>

        </Wrapper>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        buttonContainer: {
            height: 40,
            flexDirection: 'row',
            columnGap: Spacing.base,
        },
        wordsContainer: {
            flexDirection: 'row',
            columnGap: Spacing.small,
            rowGap: Spacing.small,
            flexWrap: 'wrap',
            height: 150
        },
    });
}
