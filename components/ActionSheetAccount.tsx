import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import type { EditAccountNavigationProps } from "../types/navigation";

export default (props: SheetProps) => {
    const navigation = useNavigation<EditAccountNavigationProps>();
    const { address } = props.payload;
    const i18n = useI18n();

    const data = [
        {
            title: i18n.t('edit'),
            icon: <AntDesign name="edit"/>,
            onPress: () => navigation.navigate('EditAccount', { address: address })
        }
    ];

    return (
        <ActionSheet sheetId={props.sheetId} data={data}/>
    );
}