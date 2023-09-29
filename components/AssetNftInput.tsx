import { useTheme } from "../hooks";
import { View, TouchableWithoutFeedback, Image } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect } from "react";
import TextInputContainer from "./TextInputContainer";
import { NftCollectionStore, NftStore } from "../stores";

export default (props: {
    nftId?: string,
    onChange?: Function
    opened?: boolean
}) => {

    useEffect(() => {
        if (props.opened === true) {
            _select();
        }
    }, [props.opened])

    const _select = async () => {
        const data: any = await SheetManager.show("asset_nft", {
            payload: { nftId: props.nftId },
        });

        if (data?.nftId && props.onChange) {
            props.onChange(data.nftId);
        }
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => _select()}
            style={{ minHeight: 60 }}
        >
            <View>
                <TextInputContainer note={'NFT'}>
                    <View>
                        {
                            props.nftId !== undefined &&
                            <Nft nftId={props.nftId} />
                        }
                    </View>
                </TextInputContainer>
            </View>
        </TouchableWithoutFeedback>
    );
}

const Nft = (props: {
    nftId: string
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;
    const nft = NftStore.state.nested(props.nftId).get();
    if (!nft) {
        return <></>;
    }

    const nftCollection = NftCollectionStore.state.nested(nft.nftCollectionId).get();
    if (!nftCollection) {
        return <></>;
    }

    return (
        <View style={{...styles.directionRow, ...styles.columnGapBase}}>
            <Image source={{ uri: nft.image }} resizeMode="contain" style={{
                width: 50,
                height: 50,
                borderRadius: Border.radius,
                borderWidth: Border.width,
                borderColor: Border.color
            }} />

            <View>
                <Text>{nftCollection.name}</Text>
                <Text>{nft.tokenId}</Text>
            </View>
        </View>
    );
}