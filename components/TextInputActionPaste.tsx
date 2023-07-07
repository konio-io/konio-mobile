import TextInputAction from "./TextInputAction"
import * as Clipboard from 'expo-clipboard';
import { Octicons } from '@expo/vector-icons';
import { State } from "@hookstate/core";

export default (props: {
    state: State<string>
}) => {
    return (
        <TextInputAction
            onPress={() => Clipboard.getStringAsync().then(content => props.state.set(content))}
            icon={(<Octicons name="paste" />)}
        />
    )
}