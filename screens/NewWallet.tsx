import { useNavigation } from '@react-navigation/native';
import { ButtonPrimary, Text, Wrapper } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import i18n from '../locales';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();

    const theme = useTheme().get();
    const { Color } = theme.vars;

    return (
        <Wrapper>

            <Text>{i18n.t('new_wallet_desc')}</Text>

            <ButtonPrimary
                title={i18n.t('word_seed')}
                icon={<Feather name="arrow-right" size={18} color={Color.primaryContrast} />}
                onPress={() => {
                    navigation.push('ImportWalletSeed');
                }} />

            <Text>{i18n.t('have_a_wallet')}</Text>

            <ButtonPrimary
                title={i18n.t('new_wallet')}
                icon={<Feather name="plus" size={18} color={Color.primaryContrast} />}
                onPress={() => {
                    navigation.push('NewWalletSeed');
                }} />

        </Wrapper>
    )
}