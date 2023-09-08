import { View, TouchableHighlight, StyleSheet } from 'react-native';
import { useTheme, useI18n, useCurrentKoin, useCurrentAddress, useCurrentNetworkId } from '../hooks';
import { useHookstate } from '@hookstate/core';
import { ManaStore, UserStore } from '../stores';
import { useEffect, useRef } from 'react';
import ManaStat from './ManaStat';
import Modal from './Modal';
import type { Theme } from '../types/store';
import ManaProgressLogo from './ManaProgressLogo';

export default () => {
    const FIVE_DAYS = 432e6; // 5 * 24 * 60 * 60 * 1000

    const i18n = useI18n();
    const manaState = useHookstate(ManaStore);
    const modalState = useHookstate(false);
    const currentPercent = useHookstate(0);
    const currentMana = useHookstate(-1);
    const timeRecharge = useHookstate(0);

    const koinContractId = useCurrentKoin().get();
    const address = useCurrentAddress().get();
    const networkId = useCurrentNetworkId().get();
    const koinBalanceState = useHookstate(UserStore.accounts[address].assets[networkId].coins[koinContractId].balance);
    const koinBalance = koinBalanceState.get() ?? 0;

    const update = (manaBalance: number, koinBalance: number) => {
        currentMana.set(manaBalance);
        if (koinBalance > 0) {
            currentPercent.set(Math.round(((manaBalance * 100) / koinBalance) * 100) / 100);
        }
    }

    const intervalId: { current: NodeJS.Timeout | null } = useRef(null);
    const updateInterval = () => {
        const lastUpdateMana = ManaStore.lastUpdateMana.get();
        const initialMana = ManaStore.mana.get();
        const delta = Math.min(Date.now() - lastUpdateMana, FIVE_DAYS);
        let m = initialMana + (delta * koinBalance) / FIVE_DAYS;
        m = Math.min(m, koinBalance);
        timeRecharge.set(((koinBalance - m) * FIVE_DAYS) / koinBalance);
        const manaBalance = Number(m.toFixed(8));
        update(manaBalance, koinBalance);
    }

    useEffect(() => {
        update(manaState.mana.get(), koinBalance);
        intervalId.current = setInterval(() => {
            updateInterval();
        }, 3000);

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        }
    }, [manaState, koinBalanceState]);

    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            <Modal title={i18n.t('mana_recharge')} openState={modalState}>
                <ManaStat
                    balance={currentMana.get()}
                    percent={currentPercent.get()}
                    timeRecharge={timeRecharge.get()}
                />
            </Modal>

            <TouchableHighlight onPress={() => modalState.set(true)}>
                <View style={styles.container}>
                    <ManaProgressLogo
                        size={55}
                        strokeWidth={3}
                        progressPercent={currentPercent.get()}
                    />
                </View>
            </TouchableHighlight>
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Color } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            backgroundColor: Color.base
        }
    });
}