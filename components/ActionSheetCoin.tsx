import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AssetsNavigationProp } from "../types/navigation";
import * as Clipboard from 'expo-clipboard';
import { CoinStore } from "../stores";
import Toast from "react-native-toast-message";

export default (props: SheetProps<{ 
    coinId: string 
}>) => {

    if (!props.payload?.coinId) {
        return <></>
    }
    
    const coinId = props.payload.coinId;
    const i18n = useI18n();
    const navigation = useNavigation<AssetsNavigationProp>();
    const coin = CoinStore.state.nested(coinId).get();
    
    const _delete = () => {
        navigation.navigate('Assets');
        setTimeout(() => {
            CoinStore.actions.deleteCoin(coinId);
        }, 1000)
    };

    const _copyContractId = async () => {
        await Clipboard.setStringAsync(coin.contractId);
        Toast.show({
            type: 'info',
            text1: i18n.t('copied_to_clipboard')
        });
    }

    const data = [
        {
            title: i18n.t('contract_address'),
            description: coin.contractId,
            icon: <AntDesign name="codesquareo"/>,
            onPress: () => _copyContractId()
        }
    ];

    if (coin?.symbol !== 'KOIN') {
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