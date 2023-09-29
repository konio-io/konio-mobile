import { View, StyleSheet, ScrollView } from "react-native";
import { Accordion, Screen, Text } from "../components"
import { useI18n, useTheme } from "../hooks";
import { useEffect, useState } from "react";
import { FAQ_URL } from "../lib/Constants";
import { Theme } from "../types/ui";
import { LogStore, SpinnerStore } from "../stores";

export default () => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Spacing } = theme.vars;
    const [data, setData] = useState<Array<FaqItem>>([]);
    const i18n = useI18n();

    type FaqItem = {
        question: string,
        answer: string,
        media?: string
    }

    useEffect(() => {
        SpinnerStore.actions.showSpinner();
        fetch(`${FAQ_URL}${i18n.locale}.json`)
            .then(response => response.json())
            .then(jsonResponse => {
                setData(jsonResponse);
                SpinnerStore.actions.hideSpinner();
            })
            .catch(e => {
                LogStore.actions.logError(e);
                SpinnerStore.actions.hideSpinner();
            })
    }, []);

    return (
        <Screen>
            <ScrollView style={styles.paddingBase}>
                {
                    data.map((item, index) =>
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