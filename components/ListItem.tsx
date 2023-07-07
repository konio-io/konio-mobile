import { TouchableHighlight, View } from "react-native";
import Text from "./Text";
import { useTheme } from "../hooks";
import React, { ReactElement, } from "react";

export default (props: {
    content: string | ReactElement,
    name: string,
    description?: string,
    onPress?: Function,
    onLongPress?: Function,
    icon?: ReactElement,
    right?: ReactElement,
}) => {

    const theme = useTheme();
    const { Color } = theme.vars;

    if (props.onPress || props.onLongPress) {
        return (
            <TouchableHighlight
                onPress={() => {
                    if (props.onPress) {
                        props.onPress(props.name)
                    }
                }}
                onLongPress={() => {
                    if (props.onLongPress) {
                        props.onLongPress(props.name);
                    }
                }}>
                <View style={{ backgroundColor: Color.base }}>
                    <ItemContent {...props} />
                </View>
            </TouchableHighlight>
        )
    }

    return (
        <View style={{ backgroundColor: Color.base }}>
            <ItemContent {...props} />
        </View>
    )
};

const ItemContent = (props: {
    content: string | ReactElement,
    description?: string,
    icon?: ReactElement,
    right?: ReactElement,
}) => {
    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    return (
        <View style={{ ...styles.directionRow, ...styles.paddingBase, ...styles.columnGapBase }}>
            {props.icon &&
                <View style={{ ...styles.alignCenterRow, width: 38 }}>
                    {
                        React.cloneElement(props.icon, {
                            size: 22,
                            color: Color.baseContrast
                        })
                    }
                </View>
            }


            <View style={{ ...styles.flex1, ...styles.directionRow, ...styles.alignSpaceBetweenRow }}>
                {typeof props.content === 'string' &&
                    <View>
                        <Text style={styles.textMedium}>{props.content}</Text>
                        {props.description && 
                            <Text style={styles.textSmall}>{props.description}</Text>
                        }
                    </View>
                }

                {typeof props.content !== 'string' &&
                    props.content
                }

                {props.right}
            </View>
        </View>
    )
}