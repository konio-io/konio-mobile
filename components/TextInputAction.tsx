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
        <Pressable style={{width: 20, height: 20}} onPress={() => props.onPress()}>
            {
                React.cloneElement(props.icon, {
                    size: 18,
                    color: rgba(Color.baseContrast, 0.3)
                })
            }
        </Pressable>
    )
}