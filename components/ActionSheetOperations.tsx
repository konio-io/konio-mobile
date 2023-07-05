import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign, Feather } from '@expo/vector-icons';
import { CommonActions, useNavigation } from "@react-navigation/native";
import { showToast } from "../actions";

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
            onPress: () => showToast({
                type: 'info',
                text1: i18n.t('available_soon')
            })
        }
    ];

    return (
        <ActionSheet sheetId={props.sheetId} data={data}/>
    );
}