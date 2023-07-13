import { Screen, TextInput, Button, TextInputActionPaste } from "../components"
import { useTheme } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { useNavigation } from "@react-navigation/native";
import { WcPairInputNavigationProp } from "../types/navigation";
import { View } from "react-native";
import { Feather } from '@expo/vector-icons';

export default () => {
    const navigation = useNavigation<WcPairInputNavigationProp>();
    const uri = useHookstate('');
    const theme = useTheme();
    const styles = theme.styles;

    return (
        <Screen>

            <View style={{...styles.paddingBase, ...styles.rowGapBase}}>
                <TextInput
                    value={uri.get()}
                    onChangeText={(v: string) => uri.set(v)}
                    actions={(
                        <TextInputActionPaste state={uri} />
                    )}
                />
                <Button 
                    icon={(<Feather name="link" />)}
                    title='pair' 
                    onPress={() => navigation.push('WcPair', {uri: uri.get()})} 
                />
            </View>

        </Screen>
    );
}

