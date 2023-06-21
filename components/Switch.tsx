import { Switch } from "react-native";
import { useTheme } from "../hooks";
import { rgba } from "../lib/utils";

export default (props: {
    value: boolean,
    onValueChange: Function
}) => {

    const theme = useTheme();
    const { Border, Color } = theme.vars;

    return (
        <Switch
            trackColor={{ false: rgba(Color.baseContrast, 0.1), true: Color.primary }}
            thumbColor={Border.color}
            ios_backgroundColor={Border.color}
            onValueChange={() => props.onValueChange()}
            value={props.value}
        />
    );
}