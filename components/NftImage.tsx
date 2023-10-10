import { Image, View } from "react-native";
import { useTheme } from "../hooks";
import { Nft } from "../types/store";
import Text from "./Text";

export default (props: {
    nft: Nft,
    height: number,
    width?: number,
    showId?: boolean
}) => {
    const { styles, vars } = useTheme();
    const { Border, Color} = vars;

    return (
        <View>
            <Image source={{ uri: props.nft.image }} resizeMode="contain" style={{
                width: props.width,
                height: props.height,
                borderRadius: Border.radius,
                borderWidth: Border.width,
                borderColor: Border.color
            }} />

            {
                props.showId === true &&
                    <View style={{
                        backgroundColor: Color.baseContrast,
                        position: 'absolute',
                        right: 1,
                        bottom: 1,
                        padding: 3,
                        borderTopLeftRadius: Border.radius,
                        borderBottomRightRadius: Border.radius
                    }}>
                        <Text style={{ ...styles.Text, color: Color.base }}>
                            #{props.nft.tokenId}
                        </Text>
                    </View>
            }
        </View>

    );
}