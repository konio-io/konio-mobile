import { View, Linking, TouchableOpacity } from "react-native";
import { Text, Screen, Logo, Wrapper, Link } from "../components";
import { useI18n, useTheme } from "../hooks";
import Constants from 'expo-constants';
import { PRIVACY_URL, TERMS_URL } from "../lib/Constants";
import { rgba } from "../lib/utils";
import { FontAwesome5 } from '@expo/vector-icons';

export default () => {
    const theme = useTheme();
    const i18n = useI18n();
    const styles = theme.styles;

    return (
        <Screen>
            <Wrapper>
                <View style={styles.alignCenterColumn}>
                    <Logo width={130} height={130} />
                </View>

                <View style={styles.alignCenterColumn}>
                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall, alignItems: 'baseline' }}>
                        <Link text="konio.io" onPress={() => Linking.openURL('https://konio.io')} />
                        <Text style={styles.textVersion}>v{Constants.expoConfig?.version}</Text>
                    </View>
                </View>

                <View style={{ ...styles.directionRow, ...styles.columnGapSmall, ...styles.alignCenterRow }}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/konio_io')}>
                        <FontAwesome5 name="twitter" size={24} color={rgba(theme.vars.Color.baseContrast, 0.4)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://t.me/konio_io')}>
                        <FontAwesome5 name="telegram" size={24} color={rgba(theme.vars.Color.baseContrast, 0.4)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://discord.gg/pUD4b3UDbQ')}>
                        <FontAwesome5 name="discord" size={24} color={rgba(theme.vars.Color.baseContrast, 0.4)} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.alignCenterColumn}>
                    <Link text={i18n.t('terms_of_service')} onPress={() => Linking.openURL(TERMS_URL)}></Link>
                    <Link text={i18n.t('privacy_policy')} onPress={() => Linking.openURL(PRIVACY_URL)}></Link>
                </View>

                <View style={styles.alignCenterColumn}>
                    <Text>Credits</Text>
                    <Link text="kollection.app" onPress={() => Linking.openURL('https://kollection.app')} />
                    <Link text="koincrew.com" onPress={() => Linking.openURL('https://koincrew.app')} />
                </View>


            </Wrapper>
        </Screen>
    )
}
