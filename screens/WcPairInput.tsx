import { Screen, TextInput, Button, TextInputActionPaste } from "../components"
import { useI18n, useTheme } from "../hooks";
import { useNavigation } from "@react-navigation/native";
import { WcPairInputNavigationProp } from "../types/navigation";
import { View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { logError, showToast, walletConnectPair } from "../actions";
import { useState } from "react";

export default () => {
    const navigation = useNavigation<WcPairInputNavigationProp>();
    const [uri, setUri] = useState('');
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const _pair = (uri: string) => {
        walletConnectPair(uri)
        .then(() => {
            navigation.navigate('WcSessions')
        })
        .catch(e => {
            logError(e);
            showToast({
                type: 'error',
                text1: i18n.t('pairing_error'),
                text2: i18n.t('check_logs')
            });
        });
    }

    return (
        <Screen keyboardDismiss={true}>

            <View style={{...styles.paddingBase, ...styles.rowGapBase}}>
                <TextInput
                    autoFocus={true}
                    multiline={true}
                    value={uri}
                    onChangeText={(v: string) => setUri(v)}
                    actions={(
                        <TextInputActionPaste onPaste={(value:string) => setUri(value)} />
                    )}
                />
                <Button 
                    icon={(<Feather name="link" />)}
                    title={i18n.t('pair')}
                    onPress={() => _pair(uri)} 
                />
            </View>

        </Screen>
    );
}

