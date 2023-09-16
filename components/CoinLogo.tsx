import { useHookstate } from '@hookstate/core';
import CircleLogo from './CircleLogo';
import { View, Image } from 'react-native';
import { useCoin, useTheme } from '../hooks';
import { useEffect } from "react";
import { getContractInfo } from '../lib/utils';

export default (props: {
    contractId: string
    size: number
}) => {
    const logo = useHookstate('',);
    const theme = useTheme();
    const { Border } = theme.vars;
    const coin = useCoin(props.contractId);

    useEffect(() => {
        if (!coin || !coin.logo) {
            getContractInfo(props.contractId).then(info => {
                if (info.logo) {
                    logo.set(info.logo);
                }
            });
        } else {
            logo.set(coin.logo);
        }
    }, [coin]);

    return (
        <View style={{borderRadius: props.size, borderColor: Border.color, borderWidth: Border.width, padding: 1}}>
            {logo.get() &&
                <Image style={{ width: props.size, height: props.size, borderRadius: props.size }} source={{ uri: logo.get() }} />
            }
            {!logo.get() &&
                <CircleLogo
                    seed={props.contractId}
                    name=''
                    size={props.size}
                />
            }
        </View>
    );
}