import { useNavigation } from '@react-navigation/native';
import { Button, Text, Wrapper } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import i18n from '../locales';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();

    return (
        <Wrapper>

            <Text>{i18n.t('new_wallet_desc')}</Text>

            <Button
                title={i18n.t('word_seed')}
                icon={<Feather name="arrow-right"/>}
                onPress={() => {
                    navigation.push('ImportWalletSeed');
                }} />

            <Text>{i18n.t('have_a_wallet')}</Text>

            <Button
                title={i18n.t('new_wallet')}
                icon={<Feather name="plus"/>}
                onPress={() => {
                    navigation.push('NewWalletSeed');
                }} />

        </Wrapper>
    )
}