import { View } from "react-native";
import { Text } from "../components";
import { useTheme } from "../hooks";

export default () => {
    const theme = useTheme().get();
    const { Color } = theme.vars;
  
    return (
        <View style={{ flex: 1, backgroundColor: Color.base, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color: Color.baseContrast}}>Available Soon</Text>
        </View>
    );
};