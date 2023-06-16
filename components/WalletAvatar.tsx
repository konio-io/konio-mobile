import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';

export default (props: {
    address: string,
    name: string,
    size: number
}) => {
    const theme = useTheme().get();
    const styles = createStyles(theme);
    const { Border } = theme.vars;

    const stringToColor = (string: string, saturation = 100, lightness = 75) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
          hash = hash & hash;
        }
        return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
      }

    const fontSize = (props.size-((props.size*30)/100));

    return (
        <View style={{borderColor: Border.color, borderWidth: Border.width, borderRadius: props.size, padding: 1}}>
            <View style={{
                width: props.size, 
                height: props.size, 
                borderRadius: props.size, 
                backgroundColor: stringToColor(props.address), 
                justifyContent: 'center', 
                alignItems: 'center'
            }}>
                <Text style={{fontSize, ...styles.letter}}>
                    {props.name.charAt(0).toUpperCase()}
                </Text>
            </View>
        </View>
    );
}

const createStyles = (theme : Theme) => {
    const { Color, FontFamily } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        letter: {
            fontFamily: FontFamily.sans, 
            color: Color.base
        }
    });
}