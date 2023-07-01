import { Linking, StyleSheet, View } from 'react-native';
import { Text, Logo, Wrapper, Address, Screen, Link } from '../components';
import { useTheme, useI18n } from '../hooks';
import type { Theme } from '../types/store';
import Constants from 'expo-constants';

export default () => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <Screen>
            <Wrapper>
                <Logo />

                <View style={styles.container}>
                    <Text style={styles.textVersion}>v{Constants.manifest?.version}</Text>
                    <Text style={styles.textAuthor}>by adrihoke</Text>
                    <Link text="https://konio.io" onPress={() => Linking.openURL('https://konio.io')}/>
                </View>

                <View style={styles.donationsContainer}>
                    <Text>{i18n.t('donations')}</Text>
                    <Address address="1Pbh4S8iSXRJrsa4rm4DKSBr9QhbPA4Sxj" copiable={true}/>
                </View>

            </Wrapper>
        </Screen>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            rowGap: Spacing.small,
            alignItems: 'center'
        },
        textVersion: { 
            ...theme.styles.textCenter, 
            ...theme.styles.text, 
            fontWeight: 'bold'
        },
        textAuthor: {
            ...theme.styles.textCenter, 
            ...theme.styles.textSmall
        },
        donationsContainer: {
            rowGap: Spacing.small, 
            alignItems: 'center'
        }
    });
};