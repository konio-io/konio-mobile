import { useHookstate } from "@hookstate/core";
import { useNft, useTheme } from "../hooks";
import { Image, View, Text } from 'react-native';
import { useEffect } from "react";
import { rgba } from "../lib/utils";
import { Feather } from '@expo/vector-icons';
import Loading from "../screens/Loading";

export default (props: {
    contractId: string,
    tokenId: string,
    selected?: boolean
}) => {
    console.log('rendered')
    const { tokenId, contractId } = props;
    const nft = useNft({ tokenId, contractId });
    const theme = useTheme();
    const styles = theme.styles;
    const { Border, Color } = theme.vars;

    const selected = useHookstate<boolean|undefined>(undefined);
    useEffect(() => {
        selected.set(props.selected);
    }, [props.selected])

    if (!nft.ornull) {
        return <Loading></Loading>
    }

    return (
        <View
            style={{
                backgroundColor: Color.base,
                borderRadius: Border.radius
            }}
        >
            <Image source={{ uri: nft.ornull.get().image }} resizeMode="contain" style={{
                width: 100,
                height: 100,
                borderRadius: Border.radius,
                borderWidth: Border.width,
                borderColor: Border.color,
                backgroundColor: Color.base,
            }} />

            {
                selected.ornull && selected.get() === true &&
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