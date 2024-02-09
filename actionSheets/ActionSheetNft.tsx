import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { HoldingsNavigationProp } from "../types/navigation";
import * as Clipboard from 'expo-clipboard';
import Toast from "react-native-toast-message";
import { NftStore } from "../stores";
import ActionSheetMenu from "./ActionSheetMenu";

export default (props: SheetProps<{
    nftId: string
}>) => {

    const nftId = props.payload?.nftId;
    if (!nftId) {
        return <></>;
    }

    const i18n = useI18n();
    const navigation = useNavigation<HoldingsNavigationProp>();
    const nft = NftStore.state.nested(nftId).get();

    const _copyContractId = async () => {
        await Clipboard.setStringAsync(nft.contractId);
        Toast.show({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    }

    const _copyTokenId = async () => {
        await Clipboard.setStringAsync(nft.tokenId);
        Toast.show({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    }

    const data = [
        {
            title: i18n.t('contract_address'),
            description: nft.contractId,
            icon: <AntDesign name="codesquareo"/>,
            onPress: () => _copyContractId()
        },
        {
            title: i18n.t('token_id'),
            description: `${NftStore.getters.tokenId(nft.id)} (${nft.tokenId})`,
            icon: <AntDesign name="codesquareo"/>,
            onPress: () => _copyTokenId()
        },
        {
            title: i18n.t('send'),
            icon: <Feather name="arrow-up-right" />,
            onPress: () => navigation.navigate('Withdraw', { nftId: nft.id })
        }
    ];

    return (
        <ActionSheetMenu sheetId={props.sheetId} data={data}/>
    );
}