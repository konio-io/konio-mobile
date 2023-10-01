import { TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { ReactElement } from 'react';
import { useTheme } from '../hooks';
import type { Theme } from '../types/ui';

export default (props: {
    onPress: Function,
    size?: number,
    icon: ReactElement,
    style?: Object,
    type?: string
}) => {

    const DEFAULT_SIZE = 36;

    const theme = useTheme();
    const styles = createStyles(theme);;
    const containerStyle = props.type ? styles[`${props.type}Container`] : styles.primaryContainer;
    const iconColor = props.type ? styles[`${props.type}Text`].color : styles.primaryText.color;

    return (
        <TouchableOpacity onPress={() => props.onPress()} style={{
            height: props.size ?? DEFAULT_SIZE, 
            width: props.size ?? DEFAULT_SIZE, 
            borderRadius: props.size ?? DEFAULT_SIZE,
            ...containerStyle, 
            ...props.style
        }}>
            <View style={{...containerStyle, borderRadius: props.size ?? DEFAULT_SIZE}}>
                <View style={{...styles.containerInternal, height: props.size ?? DEFAULT_SIZE}}>
                {
                    React.cloneElement(props.icon, {
                        size: 16,
                        color: iconColor
                    })
                }
                </View>

            </View>
        </TouchableOpacity>
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
            columnGap: Spacing.base
        },
        text: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base
        },
        primaryContainer: {
            backgroundColor: Color.primary
        },
        primaryText: {
            color: Color.primaryContrast
        },
        secondaryContainer: {
            backgroundColor: Border.color
        },
        secondaryText: {
            color: Color.baseContrast
        }
    });
}