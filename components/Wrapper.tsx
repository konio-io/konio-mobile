import { View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';

export default (props: {
    children: any,
    type?: string
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    if (props.type === 'full') {
        return (
            <View style={styles.wrapperFull}>
                {props.children}
            </View>
        );
    }

    return (
        <View style={styles.wrapperCentered}>
            <View style={styles.main}>
                {props.children}
            </View>
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        wrapperFull: {
            flex: 1, 
            padding: Spacing.base, 
            rowGap: Spacing.large,
            backgroundColor: Color.base
        },
        wrapperCentered: {
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: Color.base
        }
    })
}