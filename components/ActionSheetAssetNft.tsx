import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Button from "./Button";
import Text from "./Text";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useI18n, useTheme } from "../hooks";
import NftCollectionListItem from "./NftCollectionListItem";
import NftListItem from "./NftListItem";
import { useState } from "react";
import { SettingStore, NftCollectionStore, NftStore } from "../stores";

export default (props: SheetProps<{ 
    nftId?: string 
}>) => {
    const [nftId, setNftId] = useState(props.payload?.nftId ?? '');
    const theme = useTheme();
    const i18n = useI18n();
    const styles = theme.styles;

    const currentAccountId = SettingStore.state.currentAccountId.get();
    const currentNetworkId = SettingStore.state.currentAccountId.get();
    const nftCollections = NftCollectionStore.state.get();

    const data = Object.values(nftCollections).filter(nft => 
        nft.networkId === currentNetworkId &&
        nft.accountId === currentAccountId
    );

    const _select = (data: any) => {
        setNftId(data.nftId);
    }

    const _close = () => {
        SheetManager.hide(props.sheetId);
    }

    const _confirm = () => {
        if (nftId) {
            const payload = { nftId };
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
                                key={collection.id}
                                nftCollectionId={collection.id}
                                renderItem={
                                    (tId: string) =>
                                        <TouchableOpacity key={tId} onPress={() => _select({ nftId: tId })}>
                                            <NftListItem
                                                nftId={nftId}
                                                selected={tId === nftId}
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