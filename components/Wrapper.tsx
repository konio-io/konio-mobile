import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../hooks';

export default (props: {
    type?: string,
    children: any
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const type = props.type ?? 'default';

    if (type === 'full') {
        return <View style={styles.wrapperFull}>{props.children}</View>;
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.wrapper}>
                <View style={styles.main}>
                    {props.children}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

}