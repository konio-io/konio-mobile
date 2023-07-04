import { useHookstate } from '@hookstate/core';
import CircleLogo from './CircleLogo';
import { View, Image } from 'react-native';
import { useTheme } from '../hooks';

export default (props: {
    contractId: string
    size: number
}) => {
    const logo = useHookstate('',);
    const theme = useTheme();
    const { Border } = theme.vars;

    fetch(`https://konio.io/tokenlist/${props.contractId}.json`)
        .then(response => response.json())
        .then(json => {
            if (json.logo) {
                logo.set(json.logo);
            }
        });

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