import { Screen, TextInput, Button } from "../components"
import { useI18n, useTheme } from "../hooks"
import { useNavigation, useRoute } from "@react-navigation/native";
import { EditAccountNavigationProps, EditAccountRouteProp } from "../types/navigation";
import { Feather } from '@expo/vector-icons';import { View } from "react-native";
import { useState } from "react";
import { useStore } from "../stores";
import { useHookstate } from "@hookstate/core";

export default () => {
    const i18n = useI18n();
    const route = useRoute<EditAccountRouteProp>();
    const navigation = useNavigation<EditAccountNavigationProps>();
    const theme = useTheme();
    const { Account } = useStore();
    const account = useHookstate(Account.state.nested(route.params.address)).get();
    const [name, setName] = useState(account?.name ?? '');
    
    const styles = theme.styles;

    const save = () => {
        Account.actions.setAccountName(route.params.address, name);
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