import { useTheme, useCoin  } from "../hooks";
import type { Theme } from "../types/store";
import Text from "./Text";
import { StyleSheet } from "react-native";

export default (props: {
    contractId: string
}) => {
    const coin = useCoin(props.contractId);
    const theme = useTheme().get();
    const styles = createStyles(theme);
    return (<Text style={styles.symbol}>{coin.get().symbol}</Text>);
}

const createStyles = (theme: Theme) => {
    const { Color, FontFamily, FontSize } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        symbol: {
            fontFamily: FontFamily.sans,
            fontWeight: 'bold',
            fontSize: FontSize.base,
            color: Color.baseContrast
        }
    });
}