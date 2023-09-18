import TextInputAction from "./TextInputAction"
import * as Clipboard from 'expo-clipboard';
import { Octicons } from '@expo/vector-icons';

export default (props: {
    onPaste: Function
}) => {
    return (
        <TextInputAction
            onPress={() => Clipboard.getStringAsync().then(content => props.onPaste(content))}
            icon={(<Octicons name="paste" />)}
        />
    )
}