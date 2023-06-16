import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonPrimary, Logo, Text, Wrapper } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';

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
                    Welcome to KONIO! The first cross platform wallet for the Koinos blockchain.
                </Text>
                <Text>
                    Take the first steps to set up your application.
                </Text>
            </View>

            <ButtonPrimary
                title="Let's begin"
                icon={<Feather name="arrow-right" size={18} color={Color.primaryContrast} />}
                onPress={() => {
                    navigation.push('SetPassword');
                }} />

        </Wrapper>
    )
}