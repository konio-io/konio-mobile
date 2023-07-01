import React, { ReactNode } from "react"
import { Pressable, View, StyleSheet } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from "../hooks";
import type { Theme } from "../types/store";

export default (props: {
  onPress: Function,
  children: ReactNode
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { Border } = theme.vars;

  return (
    <Pressable onPress={() => props.onPress()}>
      <View style={styles.selector}>

        <View style={styles.iconContainer}>
          <AntDesign name="down" size={18} color={Border.color} />
        </View>

        {props.children}

      </View>
    </Pressable>
  );
}

const createStyles = (theme: Theme) => {
  const { Spacing } = theme.vars;

  return StyleSheet.create({
    ...theme.styles,
    selector: {
      ...theme.styles.textInput,
      rowGap: Spacing.base
    },
    iconContainer: {
      position: 'absolute',
      right: Spacing.small,
      top: Spacing.small
    }
  });
}