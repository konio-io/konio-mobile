import { useTheme, useCoin  } from "../hooks";
import Text from "./Text";

export default (props: {
    contractId: string
}) => {
    const coin = useCoin(props.contractId);
    const theme = useTheme();
    const styles = theme.styles;
    return (<Text style={styles.symbol}>{coin.get().symbol}</Text>);
}