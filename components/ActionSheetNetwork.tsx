import { SheetProps } from "react-native-actions-sheet";
import { deleteNetwork, showToast } from "../actions";
import { useNetwork, useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';

export default (props: SheetProps) => {

    const { networkId } = props.payload;
    const network = useNetwork(networkId).get();
    const i18n = useI18n();

    const _delete = () => {
        const name = network.name;
        deleteNetwork(networkId);
        showToast({
            type: 'success',
            text1: i18n.t('deleted', { name })
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