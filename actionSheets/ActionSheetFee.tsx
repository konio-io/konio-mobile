import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SheetManager, SheetProps } from "react-native-actions-sheet";
import type { Theme } from "../types/ui";
import ActionSheet from "./ActionSheet";
import { useI18n, useTheme } from "../hooks";
import { ManaStore, PayerStore } from "../stores";
import { Button, SelectedTicker, Text } from "../components";
import Slider from "@react-native-community/slider";
import { Payer } from "../types/store";
import { useEffect, useState } from "react";
import { Feather } from '@expo/vector-icons';
import { DEFAULT_PAYERS } from "../lib/Constants";
import { getStore } from "../stores/registry";

export default (props: SheetProps) => {
    const { styles, vars } = useTheme();

    const [rcLimit, setRcLimit] = useState(ManaStore.state.rcLimit.get());
    const [payer, setPayer] = useState(ManaStore.state.payer.get());

    const payers = PayerStore.getters.getCurrentPayers();
    const i18n = useI18n();

    const _confirm = () => {
        ManaStore.actions.setPayer(payer);
        ManaStore.actions.setRcLimit(rcLimit);
        SheetManager.hide(props.sheetId)
    };

    return (
        <ActionSheet id={props.sheetId} containerStyle={styles.container} closeOnTouchBackdrop={false}>

            <View style={{ ...styles.paddingBase, gap: vars.Spacing.large }}>
                <View style={{ ...styles.alignCenterColumn }}>
                    <Text style={{ ...styles.textMedium, ...styles.textBold }}>{i18n.t('rc_limit')}</Text>
                    <Text style={styles.textSmall}>{i18n.t('rc_limit_desc')}</Text>

                    <Text>{rcLimit}%</Text>
                    <Slider
                        style={{ width: '100%' }}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor={vars.Color.primary}
                        maximumTrackTintColor={vars.Border.color}
                        thumbTintColor={vars.Border.color}
                        value={rcLimit}
                        onValueChange={(v) => setRcLimit(v)}
                        step={5}
                    />
                </View>

                <View style={{ gap: vars.Spacing.medium }}>
                    <View style={{ ...styles.alignCenterColumn }}>
                        <Text style={{ ...styles.textMedium, ...styles.textBold }}>{i18n.t('payer')}</Text>
                        <Text style={{ ...styles.textSmall, ...styles.textCenter }}>{i18n.t('payer_desc')}</Text>
                    </View>

                    {
                        payers.length > 0 &&
                        <FlatList
                            data={payers}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => setPayer(item.id)}>
                                    <PayerListItem
                                        payer={item}
                                        selected={item.id === payer}
                                    />
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={{ height: vars.Spacing.base }} />}
                        />
                    }
                </View>

                <Button title={i18n.t('confirm')} onPress={() => _confirm()} icon={<Feather name="check" />} />
            </View>
        </ActionSheet>
    )
}

const PayerListItem = (props: {
    payer: Payer
    selected?: boolean
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const currentAccountId = getStore('Setting').state.currentAccountId.get();
    const currentAddress = getStore('Account').state.nested(currentAccountId).address.get();
    
    const [selected, setSelected] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        setSelected(props.selected);
    }, [props.selected]);

    return (
        <View style={styles.listContainer}>
            <View>
                <Text style={styles.textMedium}>{props.payer.name}</Text>
                {
                    currentAddress !== props.payer.id &&
                    <Text style={styles.badgeFree}>Free $MANA</Text>
                }
            </View>

            {
                selected !== undefined &&
                <View>
                    <SelectedTicker selected={selected} />
                </View>
            }
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, Spacing, Border, FontSize } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...styles,
        container: {
            backgroundColor: Color.base,
            ...styles.alignCenterRow,
            ...styles.paddingBase
        },
        listContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //paddingVertical: Spacing.base
        },
        listLeftContainer: {
            flexDirection: 'row',
            columnGap: Spacing.base,
            alignItems: 'center'
        },
        badgeFree: {
            color: Color.success,
            fontSize: FontSize.small
        }
    });
}
