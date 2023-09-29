import { View, TouchableOpacity } from 'react-native';
import { useKoinBalance, useTheme } from '../hooks';
import { useEffect, useRef, useState } from 'react';
import ManaStat from './ManaStat';
import ActionSheet, { SheetManager, SheetProps, registerSheet } from 'react-native-actions-sheet';
import { ManaStore } from '../stores';
import { useHookstate } from '@hookstate/core';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';

export default () => {
    const FIVE_DAYS = 432e6; // 5 * 24 * 60 * 60 * 1000

    const mana = useHookstate(ManaStore.state).get();
    const koinBalance = useKoinBalance();

    const [currentPercent, setCurrentPercent] = useState(0);
    const [currentMana, setCurrentMana] = useState(-1);
    const [timeRecharge, setTimeRecharge] = useState(0);

    const update = (manaBalance: number, koinBalance: number) => {
        setCurrentMana(manaBalance);
        if (koinBalance > 0) {
            const perc = Math.round(((manaBalance * 100) / koinBalance) * 100) / 100;
            setCurrentPercent(perc > 100 ? 100 : perc);
        }
    }

    const intervalId: { current: NodeJS.Timeout | null } = useRef(null);
    const updateInterval = () => {
        const lastUpdateMana = mana.lastUpdateMana;
        const initialMana = mana.mana;
        const delta = Math.min(Date.now() - lastUpdateMana, FIVE_DAYS);
        let m = initialMana + (delta * koinBalance) / FIVE_DAYS;
        m = Math.min(m, koinBalance);
        setTimeRecharge(((koinBalance - m) * FIVE_DAYS) / koinBalance);
        const manaBalance = Number(m.toFixed(8));
        update(manaBalance, koinBalance);
    }

    useEffect(() => {
        update(mana.mana, koinBalance);
        intervalId.current = setInterval(() => {
            updateInterval();
        }, 3000);

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        }
    }, [mana, koinBalance]);

    const theme = useTheme();
    const styles = theme.styles;
    const { Color, Border } = theme.vars;
    const UnloadedColor = Border.color;
    const LoadedColor = Color.success;

    return (
        <View>
            <TouchableOpacity onPress={() =>
                SheetManager.show('mana', {
                    payload: {
                        currentMana,
                        currentPercent,
                        timeRecharge
                    }
                })
            }>
                <View style={{width: 200, alignItems: 'center'}}>
                    
                    {/*
                    <View style={{
                        width: '100%',
                        height: 4,
                        backgroundColor: UnloadedColor,
                        borderRadius: 4
                    }}>
                        <View style={{
                            position: 'absolute',
                            width: `${currentPercent}%`,
                            height: '100%',
                            top: 0,
                            left: 0,
                            backgroundColor: LoadedColor,
                            borderRadius: 4
                        }}/>
                    </View>

                    */}

                    <View style={{ ...theme.styles.directionRow, columnGap: 2 }}>
                        <Ionicons name="timer-outline" size={14} color={LoadedColor} />
                        <Text style={{ ...theme.styles.text, color: LoadedColor, fontSize: 12, lineHeight: 16 }}>MANA</Text>
                        <Text style={{ ...theme.styles.text, color: LoadedColor, fontSize: 12, lineHeight: 16 }}> {currentPercent}</Text>
                        <Text style={{ ...theme.styles.text, color: LoadedColor, fontSize: 10, lineHeight: 16 }}>%</Text>
                    </View>

                </View>
            </TouchableOpacity>
        </View>
    );
}

const ActionSheetMana = (props: SheetProps<{ currentMana: number, currentPercent: number, timeRecharge: number }>) => {
    const theme = useTheme();

    return (
        <ActionSheet
            id={props.sheetId}
            containerStyle={{ ...theme.styles.paddingBase, ...theme.styles.rowGapMedium, backgroundColor: theme.vars.Color.base }}
        >
            <ManaStat
                balance={props.payload?.currentMana ?? 0}
                percent={props.payload?.currentPercent ?? 0}
                timeRecharge={props.payload?.timeRecharge ?? 0}
            />
        </ActionSheet>
    );
}
registerSheet('mana', ActionSheetMana);