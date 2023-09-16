import { useCoin, useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useEffect } from "react";
import CoinLogo from "./CoinLogo";
import TextInputContainer from "./TextInputContainer";

export default (props: {
    value?: string
    onChange?: Function
    opened?: boolean
}) => {

    const i18n = useI18n();

    useEffect(() => {
        if (props.opened == true) {
            _select();
        }
    }, [props.opened])

    const _select = async () => {
        const data: any = await SheetManager.show("asset_coin", {
            payload: {
                contractId: props.value
            },
        });

        if (data?.contractId && props.onChange) {
            props.onChange(data.contractId);
        }
    }

    return (
        <TextInputContainer note={i18n.t('coin')}>
            <TouchableWithoutFeedback
                onPress={() => _select()}
                style={{ minHeight: 60 }}
                containerStyle={{ flexGrow: 1 }}
            >
                {
                    props.value !== undefined &&
                    <Coin contractId={props.value} />
                }
            </TouchableWithoutFeedback>
        </TextInputContainer>
    );
}

const Coin = (props: {
    contractId: string
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const coin = useCoin(props.contractId);
    if (!coin) {
        return <></>;
    }

    return (
        <View style={{...styles.directionRow, ...styles.columnGapBase, ...styles.alignCenterColumn}}>
            <CoinLogo contractId={props.contractId} size={48} />

            <View>
                <Text style={styles.symbol}>{coin.symbol}</Text>
                <Text>{coin.name}</Text>
            </View>
        </View>
    );
}