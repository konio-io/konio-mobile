import { DrawerToggler, Screen } from '../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawNavigationProp, WithdrawRouteProp } from '../types/navigation';
import { View } from 'react-native';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';
import { useEffect, useState } from 'react';
import WithdrawCoin from '../components/WithdrawCoin';
import WithdrawNft from '../components/WithdrawNft';
import { useI18n } from '../hooks';

export default () => {
    const route = useRoute<WithdrawRouteProp>();
    const navigation = useNavigation<WithdrawNavigationProp>();
    const [category, setCategory] = useState(CATEGORY_COINS);
    const [coinId, setCoinId] = useState<string|undefined>(undefined);
    const [nftId, setNftId] = useState<string|undefined>(undefined);
    const i18n = useI18n();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: i18n.t('send'),
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />)
        });
    }, [navigation]);

    useEffect(() => {
        if (route.params?.coinId) {
            setCoinId(route.params.coinId);
            setCategory(CATEGORY_COINS);
        }
        if (route.params?.nftId) {
            setNftId(route.params.nftId);
            setCategory(CATEGORY_NFTS);
        }
    }, [route.params]);

    return (
        <Screen insets={true}>
            <View>
                <AssetToggler selected={category} onChange={(value: string) => setCategory(value)}/>
            </View>

            {
                category === CATEGORY_COINS &&
                <WithdrawCoin coinId={coinId}/>
            }
            {
                category === CATEGORY_NFTS &&
                <WithdrawNft nftId={nftId}/>
            }
        </Screen>
    );
}



