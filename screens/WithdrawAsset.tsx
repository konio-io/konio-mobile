import { DrawerToggler, Screen } from '../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawAssetNavigationProp, WithdrawAssetRouteProp } from '../types/navigation';
import { View } from 'react-native';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';
import { useEffect, useState } from 'react';
import WithdrawCoin from '../components/WithdrawCoin';
import WithdrawNft from '../components/WithdrawNft';

export default () => {
    const route = useRoute<WithdrawAssetRouteProp>();
    const navigation = useNavigation<WithdrawAssetNavigationProp>();
    const [category, setCategory] = useState(CATEGORY_COINS);
    const [to, setTo] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'send',
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />)
        });
    }, [navigation]);

    useEffect(() => {
        if (route.params.to) {
            setTo(route.params.to);
        }
    }, [route]);

    return (
        <Screen insets={true}>
            <View>
                <AssetToggler selected={category} onChange={(value: string) => setCategory(value)}/>
            </View>

            {
                category === CATEGORY_COINS &&
                <WithdrawCoin to={to}/>
            }
            {
                category === CATEGORY_NFTS &&
                <WithdrawNft to={to}/>
            }
        </Screen>
    );
}



