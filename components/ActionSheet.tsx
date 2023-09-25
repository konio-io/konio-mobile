import { ReactElement } from "react";
import { useTheme } from "../hooks";
import { FlatList, TouchableOpacity, View, StyleSheet } from "react-native";
import Text from "./Text";
import React from "react";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import type { Theme } from "../types/ui";

export default (props: {
    sheetId: string,
    data: Array<any>
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <ActionSheet id={props.sheetId} containerStyle={styles.container}>
            <FlatList
                data={props.data}
                renderItem={({ item }) => <Item
                    onPress={item.onPress}
                    icon={item.icon} title={item.title}
                    description={item.description}
                    sheetId={props.sheetId}
                />}
            />
        </ActionSheet>
    );
};

const Item = (props: {
    onPress: Function,
    icon?: ReactElement,
    title: string,
    description?: string,
    sheetId: string
}) => {

    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color } = theme.vars;

    return (
        <TouchableOpacity onPress={() => {
            props.onPress();
            SheetManager.hide(props.sheetId);
        }}>
            <View style={styles.listItemContainer}>
                {props.icon &&
                    React.cloneElement(props.icon, {
                        size: 18,
                        color: Color.baseContrast
                    })
                }

                <View>
                    <Text>{props.title}</Text>
                    {props.description &&
                        <Text style={styles.textSmall}>{props.description}</Text>
                    }
                </View>

            </View>
        </TouchableOpacity>
    )
}

const createStyles = (theme: Theme) => {
    const { Color, Spacing } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...styles,
        container: {
            backgroundColor: Color.base,
            paddingBottom: 20
        },
        listItemContainer: {
            padding: Spacing.base,
            flexDirection: 'row',
            columnGap: Spacing.base,
            backgroundColor: Color.base
        }
    });
}