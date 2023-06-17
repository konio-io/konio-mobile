import { View, StyleSheet } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Text, ButtonPrimary, ButtonPrimaryEmpty, TextInput, Wrapper } from '../components';
import { generateSeed, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import i18n from '../locales';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const seed = useHookstate('');
    const name = useHookstate('');

    const theme = useTheme().get();
    const { Color } = theme.vars;
    const styles = createStyles(theme);

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

            <TextInput
                style={{...styles.textInputMultiline}}
                multiline={true}
                numberOfLines={4}
                editable={false}
                value={seed.get()}
            />

            <View style={styles.buttonContainer}>
                <View style={{ flex: 1 }}>
                    <ButtonPrimaryEmpty
                        title={i18n.t('generate')}
                        icon={<Feather name="refresh-cw" size={18} color={Color.primary} />}
                        onPress={() => seed.set(generateSeed())} />
                </View>

                <View style={{ flex: 1 }}>
                    <ButtonPrimary
                        title={i18n.t('next')}
                        icon={<Feather name="arrow-right" size={18} color={Color.primaryContrast} />}
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
        }
    });
}
