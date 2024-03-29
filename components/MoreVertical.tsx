import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useTheme } from "../hooks";
import { Feather } from '@expo/vector-icons';

export default (props: {
    onPress: Function
  }) => {
    const theme = useTheme();
    const { Spacing, Color } = theme.vars;
  
    return (
      <TouchableOpacity onPress={() => props.onPress()}>
        <View style={{ padding: Spacing.base }}>
          <Feather color={Color.baseContrast} size={24} name="more-vertical" />
        </View>
      </TouchableOpacity>
    )
  }
  