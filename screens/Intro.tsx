import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonPrimary, Logo, Text, Wrapper } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import i18n from '../locales';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();

    const theme = useTheme().get();
    const { Color, Spacing } = theme.vars;

    return (
        <Wrapper>

            <View style={{ marginBottom: Spacing.medium, alignItems: 'center' }}>
                <Logo />
            </View>

            <View>
                <Text>
                    {i18n.t('welcome')}
                </Text>
                <Text>
                    {i18n.t('welcome_2')}
                </Text>
            </View>

            <ButtonPrimary
                title={i18n.t('lets_begin')}
                icon={<Feather name="arrow-right" size={18} color={Color.primaryContrast} />}
                onPress={() => {
                    navigation.push('SetPassword');
                }} />

        </Wrapper>
    )
}