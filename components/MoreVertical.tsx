import React from "react";
import { TouchableHighlight, View } from "react-native";
import { useTheme } from "../hooks";
import { Feather } from '@expo/vector-icons';

export default (props: {
    onPress: Function
  }) => {
    const theme = useTheme();
    const { Spacing, Color } = theme.vars;
  
    return (
      <TouchableHighlight onPress={() => props.onPress()}>
        <View style={{ padding: Spacing.base, backgroundColor: Color.base }}>
          <Feather color={Color.baseContrast} size={24} name="more-vertical" />
        </View>
      </TouchableHighlight>
    )
  }
  