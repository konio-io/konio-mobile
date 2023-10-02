import { useTheme } from "../hooks";
import { StyleSheet } from "react-native";
import React from "react";
import ActionSheet from "react-native-actions-sheet";
import type { Theme } from "../types/ui";

export default (props: any) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <ActionSheet {...props} containerStyle={{...styles.container, ...props.containerStyle}}>
            {props.children}
        </ActionSheet>
    );
};

const createStyles = (theme: Theme) => {
    const { Color } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...styles,
        container: {
            backgroundColor: Color.base
        }
    });
}