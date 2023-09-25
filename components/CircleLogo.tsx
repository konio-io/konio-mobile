import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/ui';

export default (props: {
    name: string
    seed: string
    size: number
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const stringToColor = (string: string, saturation = 100, lightness = 75) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
    }

    const fontSize = (props.size - ((props.size * 30) / 100));

    return (
        <View style={{
            ...styles.container,
            width: props.size,
            height: props.size,
            borderRadius: props.size,
            backgroundColor: stringToColor(props.seed),
        }}>
            <Text style={{ ...styles.letter, fontSize }}>
                {props.name.charAt(0).toUpperCase()}
            </Text>
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, FontFamily } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        letter: {
            fontFamily: FontFamily.sans,
            color: Color.base
        },
        container: {
            justifyContent: 'center',
            alignItems: 'center'
        }
    });
}