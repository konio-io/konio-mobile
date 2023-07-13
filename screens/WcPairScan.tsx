import { Screen } from "../components"
import { useNavigation } from "@react-navigation/native";
import { WcPairNavigationProp } from "../types/navigation";
import CodeScanner from "../components/CodeScanner";

export default () => {
    const navigation = useNavigation<WcPairNavigationProp>();

    return (
        <Screen>
            <CodeScanner onScan={(uri: string) => navigation.navigate('WcPair', {uri})} />
        </Screen>
    );
}

