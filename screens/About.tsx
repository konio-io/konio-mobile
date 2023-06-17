import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Text, Logo, Wrapper, Address } from '../components';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import Constants from 'expo-constants';
import i18n from '../locales';

export default () => {

    const theme = useTheme().get();
    const styles = createStyles(theme);
    const { Color } = theme.vars;

    return (
        <Wrapper>
            <Logo />

            <View>
                <Text style={{ ...styles.textCenter, ...styles.text, fontWeight: 'bold' }}>v{Constants.manifest?.version}</Text>
                <Text style={{ ...styles.textCenter, ...styles.textSmall }}>by adrihoke</Text>
            </View>

            <View>
                <Text style={{ ...styles.textCenter, ...styles.text }}>{i18n.t('donations')}</Text>
                <Address address="1Pbh4S8iSXRJrsa4rm4DKSBr9QhbPA4Sxj" />
            </View>

            <Pressable onPress={() => Linking.openURL('https://konio.io')}>
                <Text style={{ ...styles.textCenter, color: Color.primary }}>https://konio.io</Text>
            </Pressable>
        </Wrapper>
    );
}

const createStyles = (theme: Theme) => {
    return StyleSheet.create({
        ...theme.styles,
        container: {
            justifyContent: 'center',
            alignItems: 'center'
        }
    });
};