import { TouchableOpacity, View } from "react-native";
import Text from "./Text";
import { useTheme } from "../hooks";
import React, { ReactElement, useEffect, useState, } from "react";
import SelectedTicker from "./SelectedTicker";

export default (props: {
    content: string | ReactElement,
    onPress?: Function,
    onLongPress?: Function,
    icon?: ReactElement,
    right?: ReactElement,
    selected?: boolean
}) => {

    const theme = useTheme();
    const { Color } = theme.vars;

    if (props.onPress || props.onLongPress) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (props.onPress) {
                        props.onPress()
                    }
                }}
                onLongPress={() => {
                    if (props.onLongPress) {
                        props.onLongPress();
                    }
                }}>
                <View style={{ backgroundColor: Color.base }}>
                    <ItemContent {...props} selected={props.selected} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ backgroundColor: Color.base }}>
            <ItemContent {...props} selected={props.selected} />
        </View>
    )
};

const ItemContent = (props: {
    content: string | ReactElement,
    icon?: ReactElement,
    right?: ReactElement,
    selected?: boolean
}) => {
    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    const [selected, setSelected] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

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

            <View style={{ ...styles.flex1, ...styles.directionRow, ...styles.alignSpaceBetweenRow, ...styles.alignCenterColumn }}>
                {typeof props.content === 'string' &&
                    <View>
                        <Text style={styles.textMedium}>{props.content}</Text>
                    </View>
                }

                {typeof props.content !== 'string' &&
                    props.content
                }

                {props.right}

                {
                    selected !== undefined &&
                    <View>
                        <SelectedTicker selected={selected}/>
                    </View>
                }
            </View>
        </View>
    )
}