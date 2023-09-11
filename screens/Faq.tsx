import { View, StyleSheet, ScrollView } from "react-native";
import { Accordion, Screen, Text } from "../components"
import { useI18n, useTheme } from "../hooks";
import { useEffect } from "react";
import { useHookstate } from "@hookstate/core";
import { FAQ_URL } from "../lib/Constants";
import { Theme } from "../types/store";

export default () => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Spacing } = theme.vars;
    const data = useHookstate<Array<FaqItem>>([]);
    const i18n = useI18n();

    type FaqItem = {
        question: string,
        answer: string,
        media?: string
    }

    useEffect(() => {
        fetch(`${FAQ_URL}${i18n.locale}.json`)
            .then(response => response.json())
            .then(jsonResponse => {
                data.set(jsonResponse);
            })
    }, []);

    return (
        <Screen>
            <ScrollView style={styles.paddingBase}>
                {
                    data.get().map((item, index) =>
                        <View key={index} style={styles.paddingVerticalSmall}>
                            <Accordion
                                header={(
                                    <View style={styles.paddingHorizontalBase}>
                                        <Text style={styles.question}>{index + 1}. {item.question}</Text>
                                    </View>
                                )}
                            >
                                <View style={{paddingTop: Spacing.small, paddingLeft: Spacing.base, paddingRight: Spacing.base, paddingBottom: Spacing.base}}>
                                    <Text>{item.answer}</Text>
                                </View>
                            </Accordion>
                        </View>
                    )
                }
            </ScrollView>

        </Screen>
    );
}

const createStyles = (theme: Theme) => {
    const { FontFamily, FontSize, Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        question: {
            fontFamily: FontFamily.sans+'_bold',
            fontSize: FontSize.base,
            color: Color.baseContrast
        }
    });
}