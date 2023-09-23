import CircleLogo from './CircleLogo';
import { View, Image } from 'react-native';
import { useCoin, useCurrentAddress, useTheme } from '../hooks';
import { useEffect, useState } from "react";
import { getContractInfo } from '../lib/utils';
import { useCurrentNetworkId } from '../hooks';
import { useHookstate } from '@hookstate/core';
import { UserStore } from '../stores';

export default (props: {
    contractId: string
    size: number
}) => {
    const [logo,setlogo] = useState('',);
    const theme = useTheme();
    const { Border } = theme.vars;
    //const coin = useCoin(props.contractId);

    const currentAddress = useCurrentAddress();
    const currentNetworkId = useCurrentNetworkId();
    const coinLogo = useHookstate(UserStore.accounts[currentAddress].assets[currentNetworkId].coins[props.contractId].logo);

    console.log('--- render logo', props.contractId)

    useEffect(() => {
        if (!coinLogo?.get()) {
            getContractInfo(props.contractId).then(info => {
                if (info.logo) {
                    setlogo(info.logo);
                }
            });
        } else {
            setlogo(coinLogo.get());
        }
    }, [coinLogo]);

    return (
        <View style={{borderRadius: props.size, borderColor: Border.color, borderWidth: Border.width, padding: 1}}>
            {logo &&
                <Image style={{ width: props.size, height: props.size, borderRadius: props.size }} source={{ uri: logo }} />
            }
            {!logo &&
                <CircleLogo
                    seed={props.contractId}
                    name=''
                    size={props.size}
                />
            }
        </View>
    );
}