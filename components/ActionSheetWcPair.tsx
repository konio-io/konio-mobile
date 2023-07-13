import { SheetProps } from "react-native-actions-sheet";
import { useI18n } from "../hooks";
import ActionSheet from "./ActionSheet";
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { WcSessionsNavigationProp } from "../types/navigation";

export default (props: SheetProps) => {
    const navigation = useNavigation<WcSessionsNavigationProp>();
    const i18n = useI18n();

    const data = [
        {
            title: i18n.t('wc_pair_scan'),
            icon: <AntDesign name="scan1"/>,
            onPress: () => navigation.navigate('WcPairScan')
        },
        {
            title: i18n.t('wc_pair_input'),
            icon: <Feather name="link"/>,
            onPress: () => navigation.navigate('WcPairInput')
        }
    ];

    return (
        <ActionSheet sheetId={props.sheetId} data={data}/>
    );
}