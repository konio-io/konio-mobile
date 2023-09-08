import { View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NftRouteProp, AssetsNavigationProp } from '../types/navigation';
import { Screen, MoreVertical, Text, Wrapper } from '../components';
import { useNft, useTheme } from '../hooks';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
    const navigation = useNavigation<AssetsNavigationProp>();
    const route = useRoute<NftRouteProp>();
    const accountNft = useNft(route.params.id);
    const nft = accountNft.get();
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;

    useEffect(() => {
        navigation.setOptions({
            title: nft.name,
            headerRight: () => {
                return (
                    <MoreVertical onPress={() => {
                        SheetManager.show('nft', { payload: { id: route.params.id } });
                    }} />
                )
            }
        });
    }, [accountNft, navigation]);

    return (
        <Screen>
            <Wrapper>
                <View style={styles.alignCenterColumn}>
                    <Image source={{ uri: nft.image }} resizeMode="contain" style={{
                        width: 250,
                        height: 250,
                        borderRadius: Border.radius
                    }} />
                    <View style={{ ...styles.paddingSmall }}>
                        <Text>{nft.name}</Text>
                        <Text style={styles.textSmall}>{nft.description}</Text>
                    </View>
                </View>
            </Wrapper>
        </Screen>
    );
}