import { useHookstate } from "@hookstate/core";
import { useNft, useNftCollection, useTheme } from "../hooks";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useEffect } from "react";
import TextInputContainer from "./TextInputContainer";
import { Image, View } from 'react-native';

export default (props: {
    nft: {
        contractId: string,
        tokenId: string,
    },
    onChange?: Function
    opened?: boolean
}) => {

    const opened = useHookstate(false);
    const nft = useHookstate({
        tokenId: '',
        contractId: ''
    });

    useEffect(() => {
        opened.set(props.opened ?? false);
    }, [props.opened])

    useEffect(() => {
        nft.set({
            tokenId: props.nft.tokenId,
            contractId: props.nft.contractId
        });
    }, [props.nft]);

    useEffect(() => {
        if (opened.get() == true) {
            _select().then(() => {
                opened.set(false);
            });
        }
    }, [opened])

    const _select = async () => {
        const value: any = await SheetManager.show("asset_nft", {
            payload: nft.get(),
        });

        if (value) {
            nft.set({
                contractId: value.contractId,
                tokenId: value.tokenId
            });
            _onChange();
        }
    }

    const _onChange = () => {
        if (props.onChange) {
            props.onChange(nft.get());
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
                    nft.contractId.get() && nft.tokenId.get() &&
                    <Nft nft={nft.get()} />
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

    if (!collection.ornull || !collection.ornull.get()) {
        return <></>;
    }

    if (!nft.ornull || !nft.ornull.get()) {
        return <></>;
    }

    return (
        <View style={{...styles.directionRow, ...styles.columnGapBase}}>
            <Image source={{ uri: nft.image.get() }} resizeMode="contain" style={{
                width: 100,
                height: 100,
                borderRadius: Border.radius,
                borderWidth: Border.width,
                borderColor: Border.color
            }} />

            <View>
                <Text>{collection.name.get()}</Text>
                <Text>{nft.tokenId.get()}</Text>
            </View>
            
        </View>
    );
}