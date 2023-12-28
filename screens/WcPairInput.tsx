import { Screen, TextInput, Button, TextInputActionPaste } from "../components"
import { useI18n, useTheme } from "../hooks";
import { useNavigation } from "@react-navigation/native";
import { SettingsNavigationProp, WcPairInputNavigationProp } from "../types/navigation";
import { View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useState } from "react";
import { WalletConnectStore, LogStore } from "../stores";
import Toast from "react-native-toast-message";

export default () => {
    const navigation = useNavigation<WcPairInputNavigationProp>();
    const settingNavigation = useNavigation<SettingsNavigationProp>();
    
    const [uri, setUri] = useState('');
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const _pair = (uri: string) => {
        WalletConnectStore.actions.pair(uri)
        .then(() => {
            navigation.navigate('WcSessions')
        })
        .catch(e => {
            LogStore.actions.logError(e);
            Toast.show({
                type: 'error',
                text1: i18n.t('pairing_error'),
                text2: i18n.t('check_logs'),
                onPress: () => settingNavigation.navigate('Settings', { screen: 'Logs' })
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

