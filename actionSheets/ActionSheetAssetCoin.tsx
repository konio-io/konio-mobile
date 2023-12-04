import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { Button, Text, CoinListItem } from "../components";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useI18n, useTheme } from "../hooks";
import { useState } from "react";
import { SettingStore, CoinStore } from "../stores";
import ActionSheet from "./ActionSheet";
import { Feather } from '@expo/vector-icons';

export default (props: SheetProps<{
    coinId?: string
}>) => {
    const [coinId, setCoinId] = useState(props.payload?.coinId);
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;

    const currentAccountId = SettingStore.state.currentAccountId.get();
    const currentNetworkId = SettingStore.state.currentNetworkId.get();
    const coins = CoinStore.state.get();

    const data = Object.values(coins).filter(coin => 
        coin.networkId === currentNetworkId &&
        coin.accountId === currentAccountId
    );
    const { Spacing } = theme.vars;

    const _confirm = () => {
        if (coinId) {
            const payload = {
                coinId
            };
            SheetManager.hide(props.sheetId, { payload });
        }
    }

    return (
        <ActionSheet
            id={props.sheetId}
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
                        <TouchableOpacity onPress={() => setCoinId(item.id)}>
                            <CoinListItem
                                coin={item}
                                selected={item.id === coinId}
                            />
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: Spacing.base }} />}
                />
            }

            {
                data.length > 0 &&
                <Button 
                    title={i18n.t('confirm')} 
                    onPress={() => _confirm()} 
                    icon={<Feather name="check"/>}
                />
            }
        </ActionSheet>
    );
}