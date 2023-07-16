import { useHookstate } from "@hookstate/core";
import { TouchableHighlight, StyleSheet, View } from "react-native";
import { Theme } from "../types/store";
import { AntDesign } from '@expo/vector-icons';
import { ReactElement } from "react";
import { useTheme } from "../hooks";

export default (props: {
    header: ReactElement,
    children?: ReactElement
}) => {

    const collapsed = useHookstate(true);
    const theme = useTheme();
    const { Border } = theme.vars;
    const styles = createStyles(theme);

    return (
        <TouchableHighlight onPress={() => collapsed.set(!collapsed.get())}>
            <View style={styles.container}>

                <View style={styles.iconContainer}>
                    {collapsed.get() &&
                        <AntDesign name="down" size={18} color={Border.color} />
                    }
                    {!collapsed.get() &&
                        <AntDesign name="up" size={18} color={Border.color} />
                    }
                </View>

                <View style={styles.detailContainer}>
                    {props.header}
                </View>

                {!collapsed.get() && props.children}
            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            padding: Spacing.base,
            backgroundColor: Color.base,
            rowGap: Spacing.small
        },
        iconContainer: {
            position: 'absolute',
            right: Spacing.small,
            top: Spacing.small
        },
        statusIconContainer: {
            flexDirection: 'row',
            columnGap: Spacing.small
        },
        detailContainer: {
            marginRight: 25
        }
    })
}