import { SheetProps } from "react-native-actions-sheet";
import { deleteNetwork } from "../actions";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';

export default (props: SheetProps) => {

    const { networkId } = props.payload;
    const i18n = useI18n();

    const _delete = () => {
        deleteNetwork(networkId);
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