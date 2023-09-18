import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, useCurrentKoin, useMana, useCoinBalance } from '../hooks';
import { useEffect, useRef, useState } from 'react';
import ManaStat from './ManaStat';
import type { Theme } from '../types/store';
import ManaProgressLogo from './ManaProgressLogo';
import ActionSheet, { SheetManager, SheetProps, registerSheet } from 'react-native-actions-sheet';

export default () => {
    const FIVE_DAYS = 432e6; // 5 * 24 * 60 * 60 * 1000

    const manaState = useMana();
    const [currentPercent, setCurrentPercent] = useState(0);
    const [currentMana, setCurrentMana] = useState(-1);
    const [timeRecharge, setTimeRecharge] = useState(0);

    const koinContractId = useCurrentKoin();
    const koinBalance = useCoinBalance(koinContractId) ?? 0;

    const update = (manaBalance: number, koinBalance: number) => {
        setCurrentMana(manaBalance);
        if (koinBalance > 0) {
            setCurrentPercent(Math.round(((manaBalance * 100) / koinBalance) * 100) / 100);
        }
    }

    const intervalId: { current: NodeJS.Timeout | null } = useRef(null);
    const updateInterval = () => {
        const lastUpdateMana = manaState.lastUpdateMana;
        const initialMana = manaState.mana;
        const delta = Math.min(Date.now() - lastUpdateMana, FIVE_DAYS);
        let m = initialMana + (delta * koinBalance) / FIVE_DAYS;
        m = Math.min(m, koinBalance);
        setTimeRecharge(((koinBalance - m) * FIVE_DAYS) / koinBalance);
        const manaBalance = Number(m.toFixed(8));
        update(manaBalance, koinBalance);
    }

    useEffect(() => {
        update(manaState.mana, koinBalance);
        intervalId.current = setInterval(() => {
            updateInterval();
        }, 3000);

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        }
    }, [manaState, koinBalance]);

    const theme = useTheme();
    const styles = createStyles(theme);

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
                <View style={styles.container}>
                    <ManaProgressLogo
                        size={55}
                        strokeWidth={3}
                        progressPercent={currentPercent}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const ActionSheetMana = (props: SheetProps<{currentMana: number, currentPercent: number, timeRecharge: number}>) => {
    const theme = useTheme();

    return (
        <ActionSheet
            id={props.sheetId}
            containerStyle={{ ...theme.styles.paddingBase, ...theme.styles.rowGapMedium }}
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


const createStyles = (theme: Theme) => {
    const { Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            backgroundColor: Color.base
        }
    });
}