import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { ContactStore } from "../stores";

export default (props: SheetProps<{ 
    address: string 
}>) => {

    const address = props.payload?.address;
    if (!address) {
        return <></>;
    }
    
    const i18n = useI18n();

    const _delete = () => {
        ContactStore.actions.deleteContact(address);
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