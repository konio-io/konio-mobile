import { DrawerToggler, Screen } from '../components';
import { useNavigation } from '@react-navigation/native';
import { WithdrawAssetNavigationProp } from '../types/navigation';
import { View } from 'react-native';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';
import { useEffect, useState } from 'react';
import WithdrawCoin from '../components/WithdrawCoin';
import WithdrawNft from '../components/WithdrawNft';

export default () => {
    const navigation = useNavigation<WithdrawAssetNavigationProp>();
    const [category, setCategory] = useState(CATEGORY_COINS);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'send',
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />)
        });
    }, [navigation]);

    return (
        <Screen insets={true}>
            <View>
                <AssetToggler selected={category} onChange={(value: string) => setCategory(value)}/>
            </View>

            {
                category === CATEGORY_COINS &&
                <WithdrawCoin/>
            }
            {
                category === CATEGORY_NFTS &&
                <WithdrawNft/>
            }
        </Screen>
    );
}



