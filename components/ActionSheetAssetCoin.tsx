import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Button from "./Button";
import Text from "./Text";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useCoins, useI18n, useTheme } from "../hooks";
import { useHookstate } from "@hookstate/core";
import CoinListItem from "./CoinListItem";

export default (props: SheetProps<{ contractId: string }>) => {
    const contractId = useHookstate(props.payload?.contractId ?? '');
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const coins = useCoins();
    const { Spacing } = theme.vars;
    const data = Object.keys(coins.get());

    const _close = () => {
        SheetManager.hide(props.sheetId);
    }

    const _confirm = () => {
        if (contractId.get()) {
            const payload = {
                contractId: contractId.get()
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
                data.length === 0 &&
                <View style={styles.alignCenterColumn}>
                    <Text>{i18n.t('no_assets')}</Text>
                </View>
            }

            {
                data.length > 0 &&
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => contractId.set(item)}>
                            <CoinListItem
                                contractId={item}
                                selected={item === contractId.get()}
                            />
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: Spacing.base }} />}
                />
            }

            <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                <Button style={{ flex: 1 }} onPress={() => _close()} type="secondary" title={i18n.t('cancel')} />

                {
                    data.length > 0 &&
                    <Button style={{ flex: 1 }} title={i18n.t('confirm')} onPress={() => _confirm()} />
                }
            </View>
        </ActionSheet>
    );
}