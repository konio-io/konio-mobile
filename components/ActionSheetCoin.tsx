import { SheetProps } from "react-native-actions-sheet";
import { deleteCoin } from "../actions";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AssetsCoinsNavigationProp } from "../types/navigation";

export default (props: SheetProps) => {

    const { contractId } = props.payload;
    const i18n = useI18n();
    const navigation = useNavigation<AssetsCoinsNavigationProp>();

    const _delete = () => {
        deleteCoin(contractId);
        navigation.navigate('AssetsCoins');
    };

    const data = [
        {
            title: i18n.t('delete'),
            icon: <AntDesign name="delete"/>,
            onPress: () => _delete()
        }
    ];

    return (
        <ActionSheet sheetId={props.sheetId} data={data}/>
    );
}