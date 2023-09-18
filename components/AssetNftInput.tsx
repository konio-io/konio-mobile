import { useCurrentAddressState, useCurrentNetworkId, useCurrentNetworkIdState, useI18n, useNft, useNftCollection, useTheme } from "../hooks";
import { View, TouchableWithoutFeedback, Image } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { useEffect, useState } from "react";
import TextInputContainer from "./TextInputContainer";
import { useHookstate } from "@hookstate/core";
import { selectCurrentAddress, selectCurrentNetworkId, selectNft } from "../selectors";
import { NFT } from "../types/store";

export default (props: {
    value?: {
        tokenId: string,
        contractId: string
    }
    onChange?: Function
    opened?: boolean
}) => {
    const currentAddress = useCurrentAddressState()
    const currentNetworkId = useCurrentNetworkIdState()
    const [s, setS] = useState<any>();

    useEffect(() => {
        setS(
            selectNft({
                address: currentAddress.get({noproxy: true}),
                networkId: currentNetworkId.get({noproxy: true}),
                contractId: props.value?.contractId ?? '',
                tokenId: props.value?.tokenId ?? ''
            })
        )

    }, [currentAddress, currentNetworkId])

    return (
        <View>
            <Text>{props.value?.tokenId}</Text>
        </View>
    )
}

/*
export default (props: {
    value?: {
        tokenId: string,
        contractId: string
    }
    onChange?: Function
    opened?: boolean
}) => {

    const i18n = useI18n();

    useEffect(() => {
        if (props.opened == true) {
            _select();
        }
    }, [props.opened])

    const _select = async () => {
        const data: any = await SheetManager.show("asset_nft", {
            payload: {
                contractId: props.value
            },
        });

        if (data?.contractId && data?.tokenId && props.onChange) {
            props.onChange({
                contractId: data.contractId,
                tokenId: data.tokenId
            });
        }
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => _select()}
            style={{ minHeight: 60 }}
        >
            <View>
                <TextInputContainer note={i18n.t('NFT')}>
                    <View>
                        {
                            props.value !== undefined &&
                            <Nft nft={props.value} />
                        }
                    </View>
                </TextInputContainer>
            </View>
        </TouchableWithoutFeedback>
    );
}

const Nft = (props: {
    nft: {
        contractId: string,
        tokenId: string
    }
}) => {
    const { contractId, tokenId } = props.nft;
    const theme = useTheme();
    const styles = theme.styles;
    const { Border } = theme.vars;
    const collection = useNftCollection(contractId);
    const nft = useNft({
        contractId,
        tokenId
    });

    if (!collection || !nft) {
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
*/