import { useCoin, useI18n, useTheme } from "../hooks";
import { View, TouchableWithoutFeedback } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
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
        <TouchableWithoutFeedback
            onPress={() => _select()}
            style={{ minHeight: 60 }}
        >
            <View>
                <TextInputContainer note={i18n.t('coin')}>
                    <View style={{minHeight: 60}}>
                        {
                            props.value !== undefined &&
                            <Coin contractId={props.value} />
                        }
                    </View>
                </TextInputContainer>
            </View>
        </TouchableWithoutFeedback>
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
        <View style={{ ...styles.directionRow, ...styles.columnGapBase, ...styles.alignCenterColumn }}>
            <CoinLogo contractId={props.contractId} size={48} />

            <View>
                <Text style={styles.symbol}>{coin.symbol}</Text>
                <Text>{coin.name}</Text>
            </View>
        </View>
    );
}