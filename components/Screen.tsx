import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';

export default (props: {
    children: any
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    
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