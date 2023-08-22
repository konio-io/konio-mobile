import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import type { EditAccountNavigationProps } from "../types/navigation";
import { deleteAccount } from "../actions";
import { getSeedAddress } from "../lib/utils";
import { Alert } from "react-native";

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

    if (getSeedAddress() !== address) {
        const showAlert = () => {
            return Alert.alert(
              i18n.t('are_you_sure'),
              i18n.t('are_you_sure_delete_account'),
              [
                {
                  text: i18n.t('yes'),
                  onPress: () => deleteAccount(address)
                },
                {
                  text: i18n.t('no'),
                },
              ]
            );
          };

        data.push({
            title: i18n.t('delete'),
            icon: <AntDesign name="delete"/>,
            onPress: () => {
                showAlert();
            }
        });
    }

    return (
        <ActionSheet sheetId={props.sheetId} data={data}/>
    );
}