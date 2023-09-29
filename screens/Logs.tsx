import { View, Share, ScrollView } from "react-native";
import { Button, Screen, Text } from "../components"
import { useI18n, useTheme } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { LogStore } from "../stores";

export default () => {
    const logs = useHookstate(LogStore.state).get();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();

    const share = async () => {
        await Share.share({
            message: logs.join('\n')
        });
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={{...styles.paddingBase, ...styles.rowGapSmall}}>
            {
                logs.length > 0 && logs.map((item,index) => 
                    <View key={index}>
                        <Text>{item}</Text>
                    </View>
                )
            }
            </ScrollView>

            <View style={{...styles.paddingBase, ...styles.directionRow, ...styles.columnGapBase}}>
                <Button style={styles.flex1} title={i18n.t('reset')} type="secondary" onPress={LogStore.actions.logReset}/>
                <Button style={styles.flex1} title={i18n.t('share')} onPress={share}/>
            </View>
        </Screen>
    );
}