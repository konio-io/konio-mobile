import { useHookstate } from '@hookstate/core';
import { DrawerToggler, Screen } from '../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawAssetNavigationProp, WithdrawAssetRouteProp } from '../types/navigation';
import { View } from 'react-native';
import { CATEGORY_COINS, CATEGORY_NFTS } from '../lib/Constants';
import AssetToggler from '../components/AssetToggler';
import { useEffect } from 'react';
import WithdrawCoin from '../components/WithdrawCoin';
import WithdrawNft from '../components/WithdrawNft';
import { useCurrentAddress, useCurrentNetworkId } from '../hooks';

export default () => {
    const currentAddress = useCurrentAddress();
    const currentNetworkId = useCurrentNetworkId();
    const route = useRoute<WithdrawAssetRouteProp>();
    const navigation = useNavigation<WithdrawAssetNavigationProp>();
    const category = useHookstate(CATEGORY_COINS);
    const to = useHookstate('');

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'send',
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />)
        });
    }, [navigation]);

    useEffect(() => {
        if (route.params.to) {
            to.set(route.params.to);
        }
    }, [route]);

    return (
        <Screen insets={true}>
            <View>
                <AssetToggler selected={category} />
            </View>

            {
                category.get() === CATEGORY_COINS &&
                <WithdrawCoin from={currentAddress.get()} to={to.get()} networkId={currentNetworkId.get()}/>
            }
            {
                category.get() === CATEGORY_NFTS &&
                <WithdrawNft from={currentAddress.get()} to={to.get()} networkId={currentNetworkId.get()}/>
            }
        </Screen>
    );
}



