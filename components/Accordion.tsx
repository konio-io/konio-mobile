import { useHookstate } from "@hookstate/core";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import { Theme } from "../types/store";
import { AntDesign } from '@expo/vector-icons';
import { ReactElement, useState } from "react";
import { useTheme } from "../hooks";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Text from "./Text";

export default (props: {
    header: ReactElement,
    children?: ReactElement
}) => {

    const collapsed = useHookstate(true);
    const theme = useTheme();
    const { Border } = theme.vars;
    const styles = createStyles(theme);
    const shareValue = useSharedValue(0);

    const [bodySectionHeight, setBodySectionHeight] = useState(0);
    const bodyHeight = useAnimatedStyle(() => ({
        height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight])
    }));

    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: `${interpolate(shareValue.value, [0, 1], [0, 180])}deg`,
                },
            ],
        };
    });

    const toggle = () => {
        if (shareValue.value === 0) {
            shareValue.value = withTiming(1, {
                duration: 500,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });
        } else {
            shareValue.value = withTiming(0, {
                duration: 500,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => toggle()}>
            <View style={styles.container}>

                <View style={styles.iconContainer}>
                    <Animated.View style={iconStyle}>
                        <AntDesign name="down" size={18} color={Border.color} />
                    </Animated.View>
                </View>

                <View style={styles.detailContainer}>
                    {props.header}
                </View>

                <Animated.View style={[styles.descStyle, bodyHeight]}>
                    <View
                        style={styles.bodyContainer}
                        onLayout={event => {
                            setBodySectionHeight(event.nativeEvent.layout.height);
                        }}>
                        {props.children}
                    </View>
                </Animated.View>

            </View>
        </TouchableWithoutFeedback>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            padding: Spacing.base,
            backgroundColor: Color.base,
            rowGap: Spacing.small
        },
        iconContainer: {
            position: 'absolute',
            right: Spacing.base,
            top: Spacing.base
        },
        detailContainer: {
            paddingRight: 25
        },
        bodyContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            paddingBottom: 20,
            width: '100%'
        },
        descStyle: {
            overflow: 'hidden'
        }
    })
}