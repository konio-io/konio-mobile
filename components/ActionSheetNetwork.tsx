import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { NetworkStore } from "../stores";

export default (props: SheetProps<{
    networkId: string
}>) => {

    const networkId = props.payload?.networkId;
    if (!networkId) {
        return <></>;
    }

    const i18n = useI18n();

    const _delete = () => {
        NetworkStore.actions.deleteNetwork(networkId);
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