import { Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Logo, Text, Wrapper, Screen, Link } from '../components';
import type { IntroNavigationProp } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { PRIVACY_URL, TERMS_URL } from '../lib/Constants';

export default () => {
    const navigation = useNavigation<IntroNavigationProp>();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const { Spacing } = theme.vars;

    return (
        <Screen>

            <Wrapper>
                <View style={{ marginBottom: Spacing.medium, alignItems: 'center' }}>
                    <Logo />
                </View>

                <View>
                    <Text>
                        {i18n.t('welcome')}
                    </Text>
                </View>

                <View style={{ marginTop: Spacing.base }}>
                    <Text>{i18n.t('disclaimer')}</Text>
                    <Link text={i18n.t('terms_of_service')} onPress={() => Linking.openURL(TERMS_URL)}></Link>
                    <Link text={i18n.t('privacy_policy')} onPress={() => Linking.openURL(PRIVACY_URL)}></Link>
                </View>
                
            </Wrapper>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('start')}
                    icon={<Feather name="arrow-right" />}
                    onPress={() => {
                        navigation.navigate('SetPassword');
                    }} />
            </View>

        </Screen>
    )
}