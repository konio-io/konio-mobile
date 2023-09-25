import TextInputAction from "./TextInputAction"
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { useI18n } from "../hooks";
import Toast from "react-native-toast-message";

export default (props: {
    copy: string
}) => {

    const i18n = useI18n();
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(props.copy);
        Toast.show({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    };

    return (
        <TextInputAction
            onPress={() => copyToClipboard()}
            icon={(<Feather name="copy" />)}
        />
    )
}