import { useNavigation } from '@react-navigation/native';
import { ButtonPrimary, Text, Wrapper } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();

    const theme = useTheme().get();
    const { Color } = theme.vars;

    return (
        <Wrapper>

            <Text>Do you already have a wallet? You can use your existing wallet by importing it via seed or private key.</Text>

            <ButtonPrimary
                title="12 word seed"
                icon={<Feather name="arrow-right" size={18} color={Color.primaryContrast} />}
                onPress={() => {
                    navigation.push('ImportWalletSeed');
                }} />

            <Text>Do you not have a wallet yet? Create one!</Text>

            <ButtonPrimary
                title="new wallet"
                icon={<Feather name="plus" size={18} color={Color.primaryContrast} />}
                onPress={() => {
                    navigation.push('NewWalletSeed');
                }} />

        </Wrapper>
    )
}