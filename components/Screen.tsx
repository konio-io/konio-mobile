import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../hooks';

export default (props: {
    children: any
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.wrapperFull}>{props.children}</View>
        </TouchableWithoutFeedback>
    );
}