import { SheetProps } from "react-native-actions-sheet";
import { deleteAddressBookItem, showToast } from "../actions";
import { useAddressbookItem, useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';

export default (props: SheetProps) => {

    const { address } = props.payload;
    const addressBookItem = useAddressbookItem(address).get({noproxy: true});
    const i18n = useI18n();

    const _delete = () => {
        const name = addressBookItem.name;
        deleteAddressBookItem(address);
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