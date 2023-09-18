import CircleLogo from './CircleLogo';
import { View, Image } from 'react-native';
import { useCoin, useTheme } from '../hooks';
import { useEffect, useState } from "react";
import { getContractInfo } from '../lib/utils';

export default (props: {
    contractId: string
    size: number
}) => {
    const [logo,setlogo] = useState('',);
    const theme = useTheme();
    const { Border } = theme.vars;
    const coin = useCoin(props.contractId);

    useEffect(() => {
        if (!coin || !coin.logo) {
            getContractInfo(props.contractId).then(info => {
                if (info.logo) {
                    setlogo(info.logo);
                }
            });
        } else {
            setlogo(coin.logo);
        }
    }, [coin]);

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