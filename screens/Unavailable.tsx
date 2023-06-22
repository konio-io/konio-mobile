import { View } from "react-native";
import { Text } from "../components";
import { useTheme, useI18n } from "../hooks";

export default () => {
    const theme = useTheme();
    const { Color } = theme.vars;
    const i18n = useI18n();
  
    return (
        <View style={{ flex: 1, backgroundColor: Color.base, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color: Color.baseContrast}}>{i18n.t('available_soon')}</Text>
        </View>
    );
};