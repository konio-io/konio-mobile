import { View, Share, ScrollView, TouchableOpacity } from "react-native";
import { Button, Screen, Text } from "../components"
import { useI18n, useTheme } from "../hooks";
import { useHookstate } from "@hookstate/core";
import { LogStore } from "../stores";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LogsNavigationProp } from "../types/navigation";
import { Octicons } from '@expo/vector-icons';

export default () => {
    const logs = useHookstate(LogStore.state).get();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const [sort, setSort] = useState(false);
    const [data, setData] = useState<Array<string>>([]);
    const navigation = useNavigation<LogsNavigationProp>();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ paddingHorizontal: theme.vars.Spacing.base }}>
                    {
                        sort === true &&
                        <TouchableOpacity  onPress={() => setSort(!sort)}>
                            <Octicons name="sort-asc" size={24} color={theme.vars.Color.baseContrast} />
                        </TouchableOpacity>

                    }
                    {
                        sort === false &&
                        <TouchableOpacity onPress={() => setSort(!sort)}>
                            <Octicons name="sort-desc" size={24} color={theme.vars.Color.baseContrast} />
                        </TouchableOpacity>
                    }
                </View>
            )
        });
    }, [navigation, theme, sort]);

    const share = async () => {
        await Share.share({
            message: logs.join('\n')
        });
    };

    useEffect(() => {
        if (sort === false) {
            setData([...logs].reverse());
        } else {
            setData([...logs]);
        }
    }, [sort]);

    return (
        <Screen>
            <ScrollView contentContainerStyle={{ ...styles.paddingBase, ...styles.rowGapSmall }}>
                {
                    logs.length > 0 && data.map((item, index) =>
                        <View key={index}>
                            <Text>{item}</Text>
                        </View>
                    )
                }
            </ScrollView>

            <View style={{ ...styles.paddingBase, ...styles.directionRow, ...styles.columnGapBase }}>
                <Button style={styles.flex1} title={i18n.t('reset')} type="secondary" onPress={LogStore.actions.logReset} />
                <Button style={styles.flex1} title={i18n.t('share')} onPress={share} />
            </View>
        </Screen>
    );
}