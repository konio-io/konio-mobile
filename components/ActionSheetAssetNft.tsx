import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Button from "./Button";
import Text from "./Text";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useI18n, useNftCollections, useTheme } from "../hooks";
import NftCollectionListItem from "./NftCollectionListItem";
import NftListItem from "./NftListItem";
import { useState } from "react";

export default (props: SheetProps<{ contractId: string, tokenId?: string }>) => {
    const [contractId, setContractId] = useState(props.payload?.contractId ?? '');
    const [tokenId, setTokenId] = useState(props.payload?.tokenId ?? '');
    const theme = useTheme();
    const i18n = useI18n();
    const styles = theme.styles;
    const data = useNftCollections();

    const _select = (data: any) => {
        setContractId(data.contractId);
        setTokenId(data.tokenId);
    }

    const _close = () => {
        SheetManager.hide(props.sheetId);
    }

    const _confirm = () => {
        if (contractId && tokenId) {
            const payload = {
                contractId,
                tokenId
            };
            SheetManager.hide(props.sheetId, { payload });
        }
    }

    return (
        <ActionSheet
            id={props.sheetId}
            closable={false}
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
                        data.map(collection =>

                            <NftCollectionListItem
                                key={collection.contractId}
                                contractId={collection.contractId}
                                renderItem={
                                    (tId: string) =>
                                        <TouchableOpacity key={tId} onPress={() => _select({ contractId: collection.contractId, tokenId: tId })}>
                                            <NftListItem
                                                contractId={collection.contractId}
                                                tokenId={tId}
                                                selected={tId === tokenId && collection.contractId === contractId}
                                            />
                                        </TouchableOpacity>
                                }
                            />
                        )
                    }
                </ScrollView>
            }

            {
                data.length > 0 &&
                <Button title={i18n.t('confirm')} onPress={() => _confirm()} />
            }

        </ActionSheet>
    );
}