import { View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NftRouteProp, AssetsNavigationProp } from '../types/navigation';
import { Screen, MoreVertical, Text, Wrapper } from '../components';
import { useCurrentAccount, useCurrentNetworkId, useTheme } from '../hooks';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";
import { useHookstate } from '@hookstate/core';
import { NftCollectionStore, NftStore } from '../stores';

export default () => {
    const navigation = useNavigation<AssetsNavigationProp>();
    const route = useRoute<NftRouteProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;
    const collection = useHookstate(NftCollectionStore.state.nested(route.params.contractId));
    const account = useCurrentAccount();
    const networkId = useCurrentNetworkId();
    const nftId = NftStore.getters.nftId(account.id, networkId, route.params.contractId, route.params.tokenId);
    const nft = useHookstate(NftStore.state.nested(nftId)).get();

    useEffect(() => {
        navigation.setOptions({
            title: route.params.tokenId,
            headerRight: () => {
                return (
                    <MoreVertical onPress={() => {
                        SheetManager.show('nft', { payload: { tokenId: route.params.tokenId, contractId: route.params.contractId } });
                    }} />
                )
            }
        });
    }, [navigation]);

    if (!collection || !nft) {
        return <></>;
    }

    return (
        <Screen>
            <Wrapper>
                <View style={{...styles.alignCenterColumn, ...styles.rowGapBase, ...styles.paddingVerticalBase}}>
                    <Image source={{ uri: nft.image }} resizeMode="contain" style={{
                        width: 300,
                        height: 300,
                        borderRadius: Border.radius
                    }} />
                    <View>
                        <Text style={{...styles.textMedium, ...styles.textBold}}>{collection.name}</Text>
                        <Text>{nft.description}</Text>
                    </View>
                </View>
            </Wrapper>
        </Screen>
    );
}