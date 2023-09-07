import { SheetProps } from "react-native-actions-sheet";
import { deleteCoin, showToast } from "../actions";
import { useCoin, useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AssetsNavigationProp } from "../types/navigation";
import * as Clipboard from 'expo-clipboard';

export default (props: SheetProps) => {

    const { contractId } = props.payload;
    const i18n = useI18n();
    const navigation = useNavigation<AssetsNavigationProp>();
    const coin = useCoin(contractId);

    if (!coin.ornull) {
        return;
    }

    const _delete = () => {
        navigation.navigate('Assets');
        deleteCoin(contractId);
    };

    const _copyContractId = async () => {
        await Clipboard.setStringAsync(contractId);
        showToast({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    }

    const data = [
        {
            title: i18n.t('contract_address'),
            description: coin.contractId.get(),
            icon: <AntDesign name="codesquareo"/>,
            onPress: () => _copyContractId()
        }
    ];

    if (coin.symbol.get() !== 'KOIN') {
        data.push({
            title: i18n.t('delete'),
            description: '',
            icon: <AntDesign name="delete"/>,
            onPress: async () => _delete()
        });
    }

    return (
        <ActionSheet sheetId={props.sheetId} data={data}/>
    );
}