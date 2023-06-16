import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';
import { ReactElement } from 'react';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';

export default (props: {
    onPress: Function,
    width?: number,
    title?: string,
    icon?: ReactElement,
    style?: Object,
    containerStyle?: Object
    textStyle?: Object
}) => {

    const theme = useTheme().get();
    const { Spacing } = theme.vars;
    const styles = createStyles(theme);
    const style = props.style ?? {};
    const containerStyle = props.containerStyle ?? {};
    const textStyle = props.textStyle ?? {};

    return (
        <TouchableHighlight onPress={() => props.onPress()} style={style}>
            <View style={{
                ...styles.buttonContainer, 
                width: 'auto', 
                flexDirection: 'row', 
                justifyContent: 'center', 
                columnGap: Spacing.base, 
                padding: Spacing.small, 
                ...containerStyle 
            }}>
                {props.icon}

                {props.title &&
                    <Text style={{ ...styles.buttonText, ...textStyle }}>
                        {props.title.toUpperCase()}
                    </Text>
                }
            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme : Theme) => {
    const { Color, FontFamily, Border, Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        buttonContainer: {
            backgroundColor: Color.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Border.radius,
            paddingHorizontal: Spacing.small,
            borderColor: Color.primary,
            borderWidth: 2
        },
        buttonText: {
            fontFamily: FontFamily.sans,
            color: Color.primaryContrast
        }
    });
}