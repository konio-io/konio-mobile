import { View, Linking } from "react-native";
import { Text, Screen, Logo, Wrapper, Link } from "../components";
import { useI18n, useTheme } from "../hooks";
import Constants from 'expo-constants';
import { PRIVACY_URL, TERMS_URL } from "../lib/Constants";

export default () => {
    const theme = useTheme();
    const i18n = useI18n();
    const styles = theme.styles;

    return (
        <Screen>
            <Wrapper>
                <View style={styles.alignCenterColumn}>
                    <Logo width={130} height={130}/>
                </View>

                <View style={styles.alignCenterColumn}>
                    <Text>v{Constants.expoConfig?.version}</Text>
                    <Link text="https://konio.io" onPress={() => Linking.openURL('https://konio.io')} />
                </View>

                <View style={styles.alignCenterColumn}>
                    <Link text={i18n.t('terms_of_service')} onPress={() => Linking.openURL(TERMS_URL)}></Link>
                    <Link text={i18n.t('privacy_policy')} onPress={() => Linking.openURL(PRIVACY_URL)}></Link>
                </View>
            </Wrapper>
        </Screen>
    )
}
