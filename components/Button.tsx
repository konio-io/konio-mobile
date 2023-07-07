import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';
import React, { ReactElement } from 'react';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';

export default (props: {
    onPress: Function,
    width?: number,
    title?: string,
    icon?: ReactElement,
    style?: Object,
    type?: string
}) => {

    const theme = useTheme();
    const styles = createStyles(theme);;
    const textStyle = props.type ? styles[`${props.type}Text`] : styles.primaryText;
    const containerStyle = props.type ? styles[`${props.type}Container`] : styles.primaryContainer;
    const iconColor = props.type ? styles[`${props.type}Text`].color : styles.primaryText.color;

    return (
        <TouchableHighlight onPress={() => props.onPress()} style={{height: 48, ...containerStyle, ...props.style}}>
            <View style={{...containerStyle}}>
                <View style={styles.containerInternal}>
                {props.icon &&
                    React.cloneElement(props.icon, {
                        size: 22,
                        color: iconColor
                    })
                }

                {props.title &&
                    <Text style={{ ...styles.text, ...textStyle }}>
                        {props.title.toUpperCase()}
                    </Text>
                }
                </View>

            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, FontFamily, FontSize, Border, Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        containerInternal: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row', 
            columnGap: Spacing.base,
            height: 48
        },
        text: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base
        },
        primaryContainer: {
            backgroundColor: Color.primary,
            borderRadius: Border.radius
        },
        primaryText: {
            color: Color.primaryContrast
        },
        secondaryContainer: {
            backgroundColor: Border.color,
            borderRadius: Border.radius
        },
        secondaryText: {
            color: Color.baseContrast
        }
    });
}