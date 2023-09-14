import { useHookstate } from "@hookstate/core";
import { useCoin, useI18n, useTheme } from "../hooks";
import { View } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useEffect } from "react";
import CoinLogo from "./CoinLogo";
import TextInputContainer from "./TextInputContainer";

export default (props: {
    contractId: string
    onChange?: Function
    opened?: boolean
}) => {

    const opened = useHookstate(false);
    const contractId = useHookstate('');
    const i18n = useI18n();

    useEffect(() => {
        contractId.set(props.contractId);
    }, [props.contractId]);

    useEffect(() => {
        opened.set(props.opened ?? false);
    }, [props.opened])

    useEffect(() => {
        if (opened.get() == true) {
            _select().then(() => {
                opened.set(false);
            });
        }
    }, [opened])

    const _select = async () => {
        const data: any = await SheetManager.show("asset_coin", {
            payload: {
                contractId: contractId.get()
            },
        });

        if (data && data.contractId) {
            contractId.set(data.contractId);
            _onChange();
        }
    }

    const _onChange = () => {
        if (props.onChange) {
            props.onChange(contractId.get());
        }
    }

    return (
        <TextInputContainer note={i18n.t('coin')}>
            <TouchableWithoutFeedback
                onPress={() => _select()}
                style={{ minHeight: 60 }}
                containerStyle={{ flexGrow: 1 }}
            >
                <Coin contractId={contractId.get()} />
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
    if (!coin.get()) {
        return <></>;
    }

    return (
        <View style={{...styles.directionRow, ...styles.columnGapBase, ...styles.alignCenterColumn}}>
            <CoinLogo contractId={props.contractId} size={48} />

            <View>
                <Text style={styles.symbol}>{coin.symbol.get()}</Text>
                <Text>{coin.name.get()}</Text>
            </View>
        </View>
    );
}