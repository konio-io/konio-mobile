import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import { AntDesign } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from "react-native-toast-message";
import { NftCollectionStore } from "../stores";
import ActionSheetMenu from "./ActionSheetMenu";
import { useNavigation } from "@react-navigation/native";
import { HoldingsNavigationProp } from "../types/navigation";

export default (props: SheetProps<{
    nftCollectionId: string
}>) => {

    const nftCollectionId = props.payload?.nftCollectionId;
    if (!nftCollectionId) {
        return <></>;
    }

    const i18n = useI18n();
    const navigation = useNavigation<HoldingsNavigationProp>();
    const nftCollection = NftCollectionStore.state.nested(nftCollectionId).get();

    const _delete = () => {
        navigation.navigate('Holdings', {
            screen: 'Assets'
        });
        setTimeout(() => {
            NftCollectionStore.actions.deleteNftCollection(nftCollectionId);
        }, 1000)
    };

    const _copyContractId = async () => {
        await Clipboard.setStringAsync(nftCollection.contractId);
        Toast.show({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    }

    const data = [
        {
            title: i18n.t('contract_address'),
            description: nftCollection.contractId,
            icon: <AntDesign name="codesquareo"/>,
            onPress: () => _copyContractId()
        },
        {
            title: i18n.t('delete'),
            icon: <AntDesign name="delete"/>,
            onPress: async () => _delete()
        },
    ];

    return (
        <ActionSheetMenu sheetId={props.sheetId} data={data}/>
    );
}