import { SheetProps } from "react-native-actions-sheet";
import { deleteCoin, showToast } from "../actions";
import { useCoin, useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';

export default (props: SheetProps) => {

    const { contractId } = props.payload;
    const coin = useCoin(contractId).get();
    const i18n = useI18n();

    const _delete = () => {
        deleteCoin(contractId);
        showToast({
            type: 'success',
            text1: i18n.t('deleted', { name: coin.symbol })
        });
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