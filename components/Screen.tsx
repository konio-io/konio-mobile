import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default (props: {
    children: any,
    insets?: boolean,
    keyboardDismiss?: boolean
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();
    
    const component = (props.insets === true) ?
        (
            <View style={{
                ...styles.wrapperFull,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>{props.children}</View>
        ) :
        (
            <View style={styles.wrapperFull}>{props.children}</View>
        );

    if (props.keyboardDismiss === true) {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                {component}
            </TouchableWithoutFeedback>
        );
    }

    return component;
}

const createStyles = (theme : Theme) => {
    const { Color } = theme.vars;

    return StyleSheet.create({
        wrapperFull: {
            flex: 1,
            backgroundColor: Color.base
        }
    })
}