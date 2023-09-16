import { useNft, useNftCollection, useTheme } from "../hooks";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useEffect } from "react";
import TextInputContainer from "./TextInputContainer";
import { Image, View } from 'react-native';

export default (props: {
    value?: {
        contractId: string,
        tokenId: string,
    },
    onChange?: Function
    opened?: boolean
}) => {
    useEffect(() => {
        if (props.opened == true) {
            _select();
        }
    }, [props.opened])

    const _select = async () => {
        const value: any = await SheetManager.show("asset_nft", {
            payload: props.value,
        });

        if (value?.tokenId && value?.contractId) {
            if (props.onChange) {
                props.onChange(value);
            }
        }
    }

    return (
        <TextInputContainer>
            <TouchableWithoutFeedback
                onPress={() => _select()}
                style={{ minHeight: 60 }}
                containerStyle={{ flexGrow: 1 }}
            >
                {
                    props.value &&
                    <Nft nft={props.value} />
                }
            </TouchableWithoutFeedback>
        </TextInputContainer>
    );
}

const Nft = (props: {
    nft: {
        contractId: string,
        tokenId: string
    }
}) => {
    const { contractId, tokenId } = props.nft;
    const collection = useNftCollection(contractId);
    const nft = useNft({ contractId, tokenId });
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;

    if (!collection) {
        return <></>;
    }

    if (!nft) {
        return <></>;
    }

    return (
        <View style={{...styles.directionRow, ...styles.columnGapBase}}>
            <Image source={{ uri: nft.image }} resizeMode="contain" style={{
                width: 100,
                height: 100,
                borderRadius: Border.radius,
                borderWidth: Border.width,
                borderColor: Border.color
            }} />

            <View>
                <Text>{collection.name}</Text>
                <Text>{nft.tokenId}</Text>
            </View>
            
        </View>
    );
}