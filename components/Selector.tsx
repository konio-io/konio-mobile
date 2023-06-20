import React, { ReactNode } from "react"
import { Pressable, View } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from "../hooks";

export default (props: {
    onPress: Function,
    children: ReactNode
}) => {

    const theme = useTheme().get();
    const styles = theme.styles;
    const { Spacing, Border } = theme.vars;

    return (
        <Pressable onPress={() => props.onPress()}>
        <View style={{ ...styles.textInput, rowGap: Spacing.base }}>
    
          <View style={{ position: 'absolute', right: Spacing.small, top: Spacing.small }}>
            <AntDesign name="down" size={18} color={Border.color}/>
          </View>
    
          {props.children}
    
        </View>
      </Pressable>
    );

}