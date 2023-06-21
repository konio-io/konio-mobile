import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Text, Logo, Wrapper, Address } from '../components';
import { useTheme, useI18n } from '../hooks';
import type { Theme } from '../types/store';
import Constants from 'expo-constants';

export default () => {

    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color, Spacing } = theme.vars;

    return (
        <Wrapper>
            <Logo />

            <View style={{ rowGap: Spacing.small }}>
                <Text style={{ ...styles.textCenter, ...styles.text, fontWeight: 'bold' }}>v{Constants.manifest?.version}</Text>
                <Text style={{ ...styles.textCenter, ...styles.textSmall }}>by adrihoke</Text>
                <Pressable onPress={() => Linking.openURL('https://konio.io')}>
                    <Text style={{ ...styles.textCenter, color: Color.primary }}>https://konio.io</Text>
                </Pressable>
            </View>

            <View style={{ rowGap: Spacing.small, alignItems: 'center' }}>
                <Text style={{ ...styles.textCenter, ...styles.text }}>{i18n.t('donations')}</Text>
                <Address address="1Pbh4S8iSXRJrsa4rm4DKSBr9QhbPA4Sxj" />
            </View>

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