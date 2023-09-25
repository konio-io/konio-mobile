import { TouchableWithoutFeedback, StyleSheet, View, ScrollView } from "react-native";
import { Theme } from "../types/ui";
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

export default (props: {
    header: ReactElement,
    children?: ReactElement
}) => {

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
                    <ScrollView
                        style={styles.bodyContainer}
                        onLayout={event => {
                            setBodySectionHeight(event.nativeEvent.layout.height);
                        }}>
                        {props.children}
                    </ScrollView>
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
            backgroundColor: Color.base,
            rowGap: Spacing.small
        },
        iconContainer: {
            position: 'absolute',
            right: Spacing.base,
            top: Spacing.base
        },
        detailContainer: {
            paddingRight: 30
        },
        bodyContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%'
        },
        descStyle: {
            overflow: 'hidden'
        }
    })
}