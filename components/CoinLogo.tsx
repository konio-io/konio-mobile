import CircleLogo from './CircleLogo';
import { View, Image } from 'react-native';
import { useEffect, useState } from "react";
import { useHookstate } from '@hookstate/core';
import CoinStore from '../stores/CoinStore';

export default (props: {
    coinId: string
    size: number
}) => {
    const [logo, setlogo] = useState('',);
    const theme = useTheme();
    const { Border } = theme.vars;
    const coinLogo = useHookstate(CoinStore.state.nested(props.coinId).logo);
    const contractId = CoinStore.state.nested(props.coinId).contractId.get();

    useEffect(() => {
        if (coinLogo?.ornull?.get()) {
            setlogo(coinLogo.ornull.get());
        }
        else {
            CoinStore.getters.fetchContractInfo(contractId).then(info => {
                if (info.logo) {
                    setlogo(info.logo);
                }
            });
        }
    }, [coinLogo]);

    return (
        <View style={{borderRadius: props.size, borderColor: Border.color, borderWidth: Border.width, padding: 1}}>
            {logo &&
                <Image style={{ width: props.size, height: props.size, borderRadius: props.size }} source={{ uri: logo }} />
            }
            {!logo &&
                <CircleLogo
                    seed={contractId}
                    name=''
                    size={props.size}
                />
            }
        </View>
    );
}