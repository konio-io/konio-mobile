import { View } from 'react-native';
import { Text, Button, TextInput, Wrapper, Screen, Seed, TextInputActionCopy } from '../components';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import type { NewWalletSeedNavigationProp } from '../types/navigation';
import { useEffect, useState } from 'react';
import TextInputAction from '../components/TextInputAction';
import Toast from 'react-native-toast-message';
import { generateSeed } from '../lib/utils';

export default () => {
    const navigation = useNavigation<NewWalletSeedNavigationProp>();
    const [seed, setSeed] = useState('');
    const [name, setName] = useState('');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const next = () => {
        if (!name) {
            Toast.show({
                type: 'error',
                text1: i18n.t('missing_account_name'),
            });
        } else {
            navigation.navigate('NewWalletSeedConfirm', { seed: seed, name: name })
        }
    }

    useEffect(() => {
        setSeed(generateSeed());
    }, []);

    return (
        <Screen keyboardDismiss={true}>
            <Wrapper>
                <Text>{i18n.t('choose_account_name')}</Text>

                <TextInput
                    autoFocus={true}
                    value={name}
                    placeholder={i18n.t('account_name')}
                    onChangeText={(text: string) => setName(text)} />

                <Text>{i18n.t('save_seed')}</Text>

                <View style={styles.textInputContainer}>
                    <Seed phrase={seed} />
                    <View style={{ ...styles.alignEndColumn }}>
                        <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                            <TextInputAction
                                onPress={() => setSeed(generateSeed())}
                                icon={(<Feather name="refresh-cw" />)}
                            />
                            <TextInputActionCopy copy={seed}/>
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