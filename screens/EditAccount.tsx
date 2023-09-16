import { Screen, TextInput, Button, Text } from "../components"
import { useI18n, useTheme, useAccount } from "../hooks"
import { useHookstate } from "@hookstate/core";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EditAccountNavigationProps, EditAccountRouteProp } from "../types/navigation";
import { setAccountName } from "../actions";
import { Feather } from '@expo/vector-icons';import { View } from "react-native";

export default () => {
    const i18n = useI18n();
    const route = useRoute<EditAccountRouteProp>();
    const navigation = useNavigation<EditAccountNavigationProps>();

    const account = useAccount(route.params.address);
    const name = useHookstate(account.name);
    const theme = useTheme();
    const styles = theme.styles;

    const save = () => {
        setAccountName(route.params.address, name.get());
        navigation.goBack();
    }

    return (
        <Screen keyboardDismiss={true}>
            <View style={{...styles.flex1, ...styles.paddingBase, ...styles.rowGapSmall}}>
                <TextInput
                    autoFocus={true}
                    value={name.get()}
                    onChangeText={(v: string) => name.set(v)}
                    placeHolder={i18n.t('name')}
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