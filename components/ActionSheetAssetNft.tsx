import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Button from "./Button";
import Text from "./Text";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useI18n, useNfts, useTheme } from "../hooks";
import { useHookstate } from "@hookstate/core";
import NftCollectionListItem from "./NftCollectionListItem";
import NftListItem from "./NftListItem";

export default (props: SheetProps<{ contractId: string, tokenId?: string }>) => {
    const contractId = useHookstate(props.payload?.contractId ?? '');
    const tokenId = useHookstate(props.payload?.tokenId ?? '');
    const theme = useTheme();
    const i18n = useI18n();
    const styles = theme.styles;
    const nfts = useNfts();
    const data = Object.keys(nfts.get());

    const _select = (data: any) => {
        contractId.set(data.contractId);
        tokenId.set(data.tokenId);
    }

    const _close = () => {
        SheetManager.hide(props.sheetId);
    }

    const _confirm = () => {
        if (contractId.get() && tokenId.get()) {
            const payload = {
                contractId: contractId.get(),
                tokenId: tokenId.get()
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
                (data.length === 0) &&

                <View style={styles.alignCenterColumn}>
                    <Text>{i18n.t('no_assets')}</Text>
                </View>
            }

            {
                data.length > 0 &&
                <ScrollView>
                    {
                        data.map(cId =>

                            <NftCollectionListItem
                                key={cId}
                                contractId={cId}
                                renderItem={
                                    (tId: string) =>
                                        <TouchableOpacity key={tId} onPress={() => _select({ contractId: cId, tokenId: tId })}>
                                            <NftListItem
                                                contractId={cId}
                                                tokenId={tId}
                                                selected={tId === tokenId.get() && cId === contractId.get()}
                                            />
                                        </TouchableOpacity>
                                }
                            />
                        )
                    }
                </ScrollView>
            }

            <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                <Button style={{flex: 1}} onPress={() => _close()} type="secondary" title={i18n.t('cancel')} />

                {
                    data.length > 0 &&
                    <Button style={{flex: 1}} title={i18n.t('confirm')} onPress={() => _confirm()} />
                }
            </View>

        </ActionSheet>
    );
}