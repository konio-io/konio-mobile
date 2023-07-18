import { Screen, TextInput, Button, TextInputActionPaste } from "../components"
import { useI18n, useTheme } from "../hooks";
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
    const i18n = useI18n();

    return (
        <Screen>

            <View style={{...styles.paddingBase, ...styles.rowGapBase}}>
                <TextInput
                    autoFocus={true}
                    multiline={true}
                    value={uri.get()}
                    onChangeText={(v: string) => uri.set(v)}
                    actions={(
                        <TextInputActionPaste state={uri} />
                    )}
                />
                <Button 
                    icon={(<Feather name="link" />)}
                    title={i18n.t('pair')}
                    onPress={() => navigation.push('WcPair', {uri: uri.get()})} 
                />
            </View>

        </Screen>
    );
}

