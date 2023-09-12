import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';

export default (props: {
    children: any,
    type?: string
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <ScrollView contentContainerStyle={styles.wrapperCentered}>
            <View style={styles.main}>
                {props.children}
            </View>
        </ScrollView>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        main: {
            width: 300,
            rowGap: Spacing.medium
        },
        wrapperCentered: {
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: Color.base
        }
    })
}