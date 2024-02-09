import { useTheme } from "../hooks";
import { View } from 'react-native';
import { useEffect, useState } from "react";
import { rgba } from "../lib/utils";
import { Feather } from '@expo/vector-icons';
import { Nft } from "../types/store";
import NftImage from "./NftImage";

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
            <NftImage nft={props.nft} width={100} height={100} showId={false}/>

            {
                selected === true &&
                <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
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