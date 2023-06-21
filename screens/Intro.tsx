import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Logo, Text, Wrapper } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const i18n = useI18n();
    const theme = useTheme();
    const { Spacing } = theme.vars;

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

            <Button
                title={i18n.t('lets_begin')}
                icon={<Feather name="arrow-right"/>}
                onPress={() => {
                    navigation.push('SetPassword');
                }} />

        </Wrapper>
    )
}