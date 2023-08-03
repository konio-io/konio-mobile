import React, { ReactElement } from "react"
import { Pressable } from "react-native"
import { rgba } from "../lib/utils"
import { useTheme } from "../hooks"

export default (props: {
    icon: ReactElement
    onPress: Function
}) => {

    const theme = useTheme();
    const { Color } = theme.vars;

    return (
        <Pressable style={{width: 22, height: 22}} onPress={() => props.onPress()}>
            {
                React.cloneElement(props.icon, {
                    size: 22,
                    color: rgba(Color.baseContrast, 0.3)
                })
            }
        </Pressable>
    )
}