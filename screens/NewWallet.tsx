import { useNavigation } from '@react-navigation/native';
import { Button, Text, Wrapper, Screen } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useI18n } from '../hooks';
import { useStore } from '../stores';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const i18n = useI18n();
    const store = useStore();

    return (
        <Screen>
            <Wrapper>

                <Text>{i18n.t('new_wallet_desc')}</Text>

                <Button
                    title={i18n.t('word_seed')}
                    icon={<Feather name="arrow-right" />}
                    onPress={() => {
                        navigation.navigate('ImportWalletSeed');
                    }} />

                <Text>{i18n.t('have_a_wallet')}</Text>

                <Button
                    title={i18n.t('new_wallet')}
                    icon={<Feather name="plus" />}
                    onPress={() => {
                        navigation.navigate('NewWalletSeed');
                    }} />

            </Wrapper>
        </Screen>
    )
}