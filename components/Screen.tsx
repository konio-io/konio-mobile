import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default (props: {
    children: any,
    insets?: boolean
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();
    
    if (props.insets === true) {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{
                    ...styles.wrapperFull,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}>{props.children}</View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.wrapperFull}>{props.children}</View>
        </TouchableWithoutFeedback>
    );
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