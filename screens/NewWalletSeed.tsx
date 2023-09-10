import { View } from 'react-native';
import { useHookstate } from '@hookstate/core';
import { Text, Button, TextInput, Wrapper, Screen, Seed, TextInputActionCopy } from '../components';
import { generateSeed, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { useEffect } from 'react';
import TextInputAction from '../components/TextInputAction';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const seed = useHookstate('');
    const name = useHookstate('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

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
    }, []);

    return (
        <Screen keyboardDismiss={true}>
            <Wrapper>
                <Text>{i18n.t('choose_account_name')}</Text>

                <TextInput
                    autoFocus={true}
                    value={name.get()}
                    placeholder={i18n.t('account_name')}
                    onChangeText={(text: string) => name.set(text)} />

                <Text>{i18n.t('save_seed')}</Text>

                <View style={styles.textInputContainer}>
                    <Seed phrase={seed.get()} />
                    <View style={{ ...styles.alignEndColumn }}>
                        <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                            <TextInputAction
                                onPress={() => seed.set(generateSeed())}
                                icon={(<Feather name="refresh-cw" />)}
                            />
                            <TextInputActionCopy copy={seed.get()}/>
                        </View>
                    </View>
                </View>
            </Wrapper>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('next')}
                    icon={<Feather name="arrow-right" />}
                    onPress={next}
                />
            </View>
        </Screen>
    );
}