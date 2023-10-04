import { View, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NftRouteProp, HoldingsNavigationProp } from '../types/navigation';
import { Screen, MoreVertical, Text, Wrapper, Button } from '../components';
import { useI18n, useTheme } from '../hooks';
import { useEffect } from 'react';
import { SheetManager } from "react-native-actions-sheet";
import { NftCollectionStore, NftStore } from '../stores';
import { Feather } from '@expo/vector-icons';
import { utils } from 'koilib';

export default () => {
    const navigation = useNavigation<HoldingsNavigationProp>();
    const route = useRoute<NftRouteProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;
    const nft = NftStore.state.nested(route.params.nftId).get();
    const collection = NftCollectionStore.state.nested(nft.nftCollectionId).get();
    const i18n = useI18n();

    useEffect(() => {
        navigation.setOptions({
            title: `#${nft.tokenId}`,
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
            <ScrollView>
                <View style={{ ...styles.alignCenterColumn, ...styles.rowGapBase, ...styles.paddingBase }}>
                    <Image source={{ uri: nft.image }} resizeMode="contain" style={{
                        width: '100%',
                        height: 300,
                        borderRadius: Border.radius
                    }} />
                    <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                        <Button
                            style={{ flex: 1 }}
                            title={i18n.t('send')}
                            onPress={() => {
                                navigation.navigate('Withdraw', {
                                    nftId: route.params.nftId
                                });
                            }}
                            icon={<Feather name="arrow-up-right" />}
                        />
                        <Button
                            style={{ flex: 1 }}
                            title={i18n.t('receive')}
                            onPress={() => navigation.navigate('Deposit')}
                            icon={<Feather name="arrow-down-right" />}
                            type='secondary'
                        />
                    </View>

                    <View>
                        <Text style={{ ...styles.textMedium, ...styles.textBold }}>{collection.name}</Text>
                        <Text>{nft.description}</Text>
                    </View>
                </View>

            </ScrollView>
        </Screen>
    );
}