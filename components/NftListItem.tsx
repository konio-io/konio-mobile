import { useTheme } from "../hooks";
import { Image, View } from 'react-native';
import { useEffect, useState } from "react";
import { rgba } from "../lib/utils";
import { Feather } from '@expo/vector-icons';
import { Nft } from "../types/store";

export default (props: {
    nft: Nft,
    selected?: boolean
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const { Border, Color } = theme.vars;

    const [selected, setSelected] = useState<boolean|undefined>(undefined);
    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected])

    return (
        <View
            style={{
                backgroundColor: Color.base,
                borderRadius: Border.radius
            }}
        >
            <Image source={{ uri: props.nft.image }} resizeMode="contain" style={{
                width: 100,
                height: 100,
                borderRadius: Border.radius,
                borderWidth: Border.width,
                borderColor: Border.color,
                backgroundColor: Color.base,
            }} />

            {
                selected === true &&
                <View style={{
                    position: 'absolute',
                    width: 100,
                    height: 100,
                    backgroundColor: rgba(Color.primary, 0.6),
                    borderRadius: Border.radius,
                    ...styles.alignCenterColumn,
                    ...styles.alignCenterRow
                }}>
                    <Feather name="check-circle" size={30} color={Color.primaryContrast}/>
                </View>
            }
        </View>
    )
}