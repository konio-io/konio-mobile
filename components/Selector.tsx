import React, { ReactNode } from "react"
import { Pressable, View, StyleSheet } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from "../hooks";
import type { Theme } from "../types/ui";
import TextInputAction from "./TextInputAction";

export default (props: {
  onPress: Function,
  children: ReactNode
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={() => props.onPress()}>
      <View style={styles.selector}>

        <View style={styles.iconContainer}>
          <TextInputAction
            onPress={() => { }}
            icon={(<AntDesign name="down" />)}
          />
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
      ...theme.styles.textInputContainer,
      rowGap: Spacing.base
    },
    iconContainer: {
      position: 'absolute',
      right: Spacing.base,
      top: Spacing.base
    }
  });
}