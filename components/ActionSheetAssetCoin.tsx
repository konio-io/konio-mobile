import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Button from "./Button";
import Text from "./Text";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useCoins, useI18n, useTheme } from "../hooks";
import CoinListItem from "./CoinListItem";
import { useState } from "react";

export default (props: SheetProps<{ 
    contractId?: string
}>) => {
    const [contractId, setContractId] = useState(props.payload?.contractId);
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const coins = useCoins();
    const { Spacing } = theme.vars;

    const _close = () => {
        SheetManager.hide(props.sheetId);
    }

    const _confirm = () => {
        if (contractId) {
            const payload = {
                contractId
            };
            SheetManager.hide(props.sheetId, { payload });
        }
    }

    return (
        <ActionSheet
            id={props.sheetId}
            closeOnTouchBackdrop={false}
            containerStyle={{ ...theme.styles.paddingBase, ...theme.styles.rowGapMedium }}
        >
            {
                coins.length === 0 &&
                <View style={styles.alignCenterColumn}>
                    <Text>{i18n.t('no_assets')}</Text>
                </View>
            }

            {
                coins.length > 0 &&
                <FlatList
                    data={coins}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setContractId(item.contractId)}>
                            <CoinListItem
                                contractId={item.contractId}
                                selected={item.contractId === contractId}
                            />
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: Spacing.base }} />}
                />
            }

            <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                <Button style={{ flex: 1 }} onPress={() => _close()} type="secondary" title={i18n.t('cancel')} />

                {
                    coins.length > 0 &&
                    <Button style={{ flex: 1 }} title={i18n.t('confirm')} onPress={() => _confirm()} />
                }
            </View>
        </ActionSheet>
    );
}