import Toast, { BaseToast } from "react-native-toast-message";
import { rgba } from "../lib/utils";
import { useTheme } from "../hooks";
import type { Theme } from "../types/store";
import { StyleSheet } from "react-native";

export default () => {

    const theme = useTheme().get();
    const styles = createStyles(theme);

    const toastConfig = {
        error: (props: any) => (
            <BaseToast
                {...props}
                style={styles.mainError}
                text1Style={styles.text1}
                text2Style={styles.text2}
            />
        ),
        success: (props: any) => (
            <BaseToast
                {...props}
                style={styles.mainSuccess}
                text1Style={styles.text1}
                text2Style={styles.text2}
            />
        ),
        info: (props: any) => (
            <BaseToast
                {...props}
                style={styles.mainInfo}
                text1Style={styles.text1}
                text2Style={styles.text2}
            />
        ),
    };

    return (<Toast config={toastConfig} />);
}

const createStyles = (theme : Theme) => {
    const { FontSize, Color } = theme.vars;

    return StyleSheet.create({
        mainError: {
            borderLeftWidth: 0,
            borderBottomColor: Color.error,
            borderBottomWidth: 3,
            backgroundColor: rgba(Color.baseContrast, 0.7)
        },
        mainSuccess: {
            borderLeftWidth: 0,
            borderBottomColor: Color.success,
            borderBottomWidth: 3,
            backgroundColor: rgba(Color.baseContrast, 0.7)
        },
        mainInfo: {
            borderLeftWidth: 0,
            borderBottomColor: Color.primary,
            borderBottomWidth: 3,
            backgroundColor: rgba(Color.baseContrast, 0.7)
        },
        text1: {
            ...theme.styles.text,
            color: Color.base
        },
        text2: {
            ...theme.styles.text,
            color: Color.base,
            fontSize: FontSize.small
        }
    });
}