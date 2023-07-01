import { Wrapper, Screen, TextInput, Button } from "../components"
import { useI18n, useTheme, useWallet } from "../hooks"
import { useHookstate } from "@hookstate/core";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EditAccountNavigationProps, EditAccountRouteProp } from "../types/navigation";
import { setAccountName, showToast } from "../actions";
import { Feather } from '@expo/vector-icons';import { View } from "react-native";

export default () => {
    const i18n = useI18n();
    const route = useRoute<EditAccountRouteProp>();
    const navigation = useNavigation<EditAccountNavigationProps>();

    const wallet = useWallet(route.params.address);
    const name = useHookstate(wallet.name.get());
    const theme = useTheme();
    const styles = theme.styles;

    const save = () => {
        setAccountName(route.params.address, name.get());
        showToast({
            type: 'success',
            text1: i18n.t('edited', {name: name.get()})
        })
        navigation.goBack();
    }

    return (
        <Screen>
            <Wrapper type="full">
                <TextInput
                    value={name.get()}
                    onChangeText={(v: string) => name.set(v)}
                    placeHolder={i18n.t('name')}
                />
            </Wrapper>

            <View style={styles.screenFooter}>
                <Button
                    title={i18n.t('save')}
                    onPress={() => save()}
                    icon={<Feather name="check" />}
                />
            </View>
        </Screen>
    );
}