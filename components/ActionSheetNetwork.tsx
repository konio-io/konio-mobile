import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { useStore } from "../stores";

export default (props: SheetProps) => {

    const { networkId } = props.payload;
    const i18n = useI18n();
    const { Network } = useStore();

    const _delete = () => {
        Network.actions.deleteNetwork(networkId);
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