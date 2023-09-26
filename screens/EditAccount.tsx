import { Screen, TextInput, Button } from "../components"
import { useI18n, useTheme } from "../hooks"
import { useNavigation, useRoute } from "@react-navigation/native";
import { EditAccountNavigationProps, EditAccountRouteProp } from "../types/navigation";
import { Feather } from '@expo/vector-icons';import { View } from "react-native";
import { useState } from "react";
import { useHookstate } from "@hookstate/core";
import { AccountStore } from "../stores";

export default () => {
    const i18n = useI18n();
    const route = useRoute<EditAccountRouteProp>();
    const navigation = useNavigation<EditAccountNavigationProps>();
    const theme = useTheme();
    const account = useHookstate(AccountStore.state.nested(route.params.accountId)).get();
    const [name, setName] = useState(account?.name ?? '');
    
    const styles = theme.styles;

    const save = () => {
        AccountStore.actions.setAccountName(route.params.accountId, name);
        navigation.goBack();
    }

    return (
        <Screen keyboardDismiss={true}>
            <View style={{...styles.flex1, ...styles.paddingBase, ...styles.rowGapSmall}}>
                <TextInput
                    autoFocus={true}
                    value={name}
                    onChangeText={(v: string) => setName(v)}
                    placeholder={i18n.t('name')}
                />
            </View>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('save')}
                    onPress={() => save()}
                    icon={<Feather name="check" />}
                />
            </View>
        </Screen>
    );
}