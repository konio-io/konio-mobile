import { View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NftRouteProp, AssetsNavigationProp } from '../types/navigation';
import { Screen, MoreVertical, Text, Wrapper } from '../components';
import { useTheme } from '../hooks';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";
import { NftCollectionStore, NftStore } from '../stores';

export default () => {
    const navigation = useNavigation<AssetsNavigationProp>();
    const route = useRoute<NftRouteProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;
    const nft = NftStore.state.nested(route.params.nftId).get();
    const collection = NftCollectionStore.state.nested(nft.nftCollectionId).get();

    useEffect(() => {
        navigation.setOptions({
            title: nft.tokenId,
            headerRight: () => {
                return (
                    <MoreVertical onPress={() => {
                        SheetManager.show('nft', { payload: { nftId: nft.id } });
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