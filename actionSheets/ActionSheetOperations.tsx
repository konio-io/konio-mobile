import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import { AntDesign, Feather } from '@expo/vector-icons';
import { CommonActions, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ActionSheetMenu from "./ActionSheetMenu";

export default (props: SheetProps) => {
    const navigation = useNavigation();
    const i18n = useI18n();

    const _navigate = (screen: string) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: screen
                    }
                ],
            })
        );
    }

    const data = [
        {
            title: i18n.t('withdraw'),
            icon: <Feather name="arrow-up-right"/>,
            onPress: () => _navigate('Withdraw')
        },
        {
            title: i18n.t('deposit'),
            icon: <Feather name="arrow-down-right"/>,
            onPress: () => _navigate('Deposit')
        },
        {
            title: i18n.t('swap'),
            icon: <AntDesign name="swap"/>,
            onPress: () => Toast.show({
                type: 'info',
                text1: i18n.t('available_soon')
            })
        }
    ];

    return (
        <ActionSheetMenu sheetId={props.sheetId} data={data}/>
    );
}