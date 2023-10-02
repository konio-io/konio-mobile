import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { HoldingsNavigationProp } from "../types/navigation";
import * as Clipboard from 'expo-clipboard';
import { CoinStore } from "../stores";
import Toast from "react-native-toast-message";
import ActionSheetMenu from "./ActionSheetMenu";

export default (props: SheetProps<{ 
    coinId: string 
}>) => {

    if (!props.payload?.coinId) {
        return <></>
    }
    
    const coinId = props.payload.coinId;
    const i18n = useI18n();
    const navigation = useNavigation<HoldingsNavigationProp>();
    const coin = CoinStore.state.nested(coinId).get();
    
    const _delete = () => {
        navigation.navigate('Holdings', {
            screen: 'Assets'
        });
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
        },
        {
            title: i18n.t('send'),
            icon: <Feather name="arrow-up-right" />,
            onPress: () => navigation.navigate('Withdraw', { coinId: coin.id })
        },
        {
            title: i18n.t('receive'),
            icon: <Feather name="arrow-down-right" />,
            onPress: () => navigation.navigate('Deposit')
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
        <ActionSheetMenu sheetId={props.sheetId} data={data}/>
    );
}