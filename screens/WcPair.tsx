import { useI18n, useW3W } from "../hooks";
import Loading from "./Loading";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WcPairNavigationProp, WcPairRouteProp } from "../types/navigation";
import { pair, showToast } from "../actions";
import { useEffect } from "react";

export default () => {
    const navigation = useNavigation<WcPairNavigationProp>();
    const route = useRoute<WcPairRouteProp>();
    const i18n = useI18n();
    const W3W = useW3W();

    const doPair = async () => {
        try {
            await pair(route.params.uri);
            navigation.navigate('WcSessions');
        } catch (e) {
            console.log(e);
            showToast({
                type: 'error',
                text1: i18n.t('pairing_error')
            });
            navigation.goBack();
        }
    }

    useEffect(() => {
        if (W3W.get()) {
            showToast({
                type: 'info',
                text1: 'uri ' + route.params.uri
            })
            doPair();
        }
    }, [W3W])

    return <Loading/>;
}

