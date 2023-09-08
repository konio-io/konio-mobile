import { SheetProps } from "react-native-actions-sheet";
import { deleteNft, showToast } from "../actions";
import { useI18n, useNft } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AssetsNavigationProp } from "../types/navigation";
import * as Clipboard from 'expo-clipboard';

export default (props: SheetProps) => {

    const { id } = props.payload;
    const i18n = useI18n();
    const navigation = useNavigation<AssetsNavigationProp>();
    const nft = useNft(id);
    
    const _delete = () => {
        navigation.navigate('Assets');
        setTimeout(() => {
            deleteNft(id);
        }, 1000)
    };

    const _copyContractId = async () => {
        await Clipboard.setStringAsync(nft.contractId.get());
        showToast({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    }

    const _copyTokenId = async () => {
        await Clipboard.setStringAsync(nft.tokenId.get());
        showToast({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    }

    const data = [
        {
            title: i18n.t('contract_address'),
            description: nft.contractId.get(),
            icon: <AntDesign name="codesquareo"/>,
            onPress: () => _copyContractId()
        },
        {
            title: i18n.t('token_id'),
            description: nft.tokenId.get(),
            icon: <AntDesign name="codesquareo"/>,
            onPress: () => _copyTokenId()
        },
        {
            title: i18n.t('delete'),
            icon: <AntDesign name="delete"/>,
            onPress: async () => _delete()
        },
    ];

    return (
        <ActionSheet sheetId={props.sheetId} data={data}/>
    );
}