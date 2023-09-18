import { DrawerToggler, Screen } from '../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawAssetNavigationProp, WithdrawAssetRouteProp } from '../types/navigation';
import { View } from 'react-native';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';
import { useEffect, useState } from 'react';
import WithdrawCoin from '../components/WithdrawCoin';
import WithdrawNft from '../components/WithdrawNft';
import { useI18n } from '../hooks';

export default () => {
    const route = useRoute<WithdrawAssetRouteProp>();
    const navigation = useNavigation<WithdrawAssetNavigationProp>();
    const [category, setCategory] = useState(CATEGORY_COINS);
    const [contractId, setContractId] = useState<string|undefined>(undefined)
    const i18n = useI18n();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: i18n.t('send'),
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />)
        });
    }, [navigation]);

    useEffect(() => {
        if (route.params.contractId) {
            setContractId(route.params.contractId)
        }
    }, [route.params])

    return (
        <Screen insets={true}>
            <View>
                <AssetToggler selected={category} onChange={(value: string) => setCategory(value)}/>
            </View>

            {
                category === CATEGORY_COINS &&
                <WithdrawCoin contractId={contractId}/>
            }
            {
                category === CATEGORY_NFTS &&
                <WithdrawNft/>
            }
        </Screen>
    );
}



