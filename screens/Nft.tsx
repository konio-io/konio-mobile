import { View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NftRouteProp, AssetsNavigationProp } from '../types/navigation';
import { Screen, MoreVertical, Text, Wrapper } from '../components';
import { useNft, useNftCollection, useTheme } from '../hooks';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
    const navigation = useNavigation<AssetsNavigationProp>();
    const route = useRoute<NftRouteProp>();
    const accountNft = useNft({
        tokenId: route.params.tokenId,
        contractId: route.params.contractId
    });
    const nft = accountNft.get();
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;
    const collection = useNftCollection(route.params.contractId);

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
    }, [accountNft, navigation]);

    return (
        <Screen>
            <Wrapper>
                <View style={{...styles.alignCenterColumn, ...styles.rowGapBase}}>
                    <Image source={{ uri: nft.image }} resizeMode="contain" style={{
                        width: '100%',
                        height: 300,
                        borderRadius: Border.radius
                    }} />
                    <View>
                        <Text style={{...styles.textMedium, ...styles.textBold}}>{collection.name.get()}</Text>
                        <Text>{nft.description}</Text>
                    </View>
                </View>
            </Wrapper>
        </Screen>
    );
}