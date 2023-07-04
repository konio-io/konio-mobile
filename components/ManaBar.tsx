import { View, TouchableHighlight, StyleSheet } from 'react-native';
import { useTheme, useI18n, useNetwork, useCurrentNetworkId } from '../hooks';
import { useHookstate } from '@hookstate/core';
import { ManaStore } from '../stores';
import { useEffect, useRef } from 'react';
import ManaStat from './ManaStat';
import Modal from './Modal';
import type { Theme } from '../types/store';
import Text from './Text';
import ActivityIndicator from './ActivityIndicator';
import CoinLogo from './CoinLogo';

export default () => {
    const FIVE_DAYS = 432e6; // 5 * 24 * 60 * 60 * 1000

    const i18n = useI18n();
    const manaState = useHookstate(ManaStore);
    const modalState = useHookstate(false);
    const currentPercent = useHookstate(0);
    const currentMana = useHookstate(-1);
    const timeRecharge = useHookstate(0);

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
        const koinBalance = ManaStore.koin.get();
        const delta = Math.min(Date.now() - lastUpdateMana, FIVE_DAYS);
        let m = initialMana + (delta * koinBalance) / FIVE_DAYS;
        m = Math.min(m, koinBalance);
        timeRecharge.set(((koinBalance - m) * FIVE_DAYS) / koinBalance);
        const manaBalance = Number(m.toFixed(8));
        update(manaBalance, koinBalance);
    }

    useEffect(() => {
        update(manaState.mana.get(), manaState.koin.get());
        intervalId.current = setInterval(() => {
            updateInterval();
        }, 3000);

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
            }
        }
    }, [manaState]);

    const theme = useTheme();
    const styles = createStyles(theme);
    const width = currentPercent.get().toString() + '%';
    const currentNetworkId = useCurrentNetworkId();
    const network = useNetwork(currentNetworkId.get());

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
                    <View style={styles.coinListItemContainer}>
                        <View style={styles.leftContainer}>
                            <CoinLogo contractId={network.coins.MANA.contractId.get()} size={36}/>
                            <View>
                                <Text style={styles.symbol}>{i18n.t('MANA')}</Text>
                                {currentMana.get() > -1 &&
                                    <Text style={styles.balance}>{currentMana.get()}</Text>
                                }
                                {currentMana.get() < 0 &&
                                    <ActivityIndicator />
                                }
                            </View>
                        </View>
                        <Text>{currentPercent.get()}%</Text>
                    </View>

                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <View style={{ ...styles.progressBarPerc, width }}></View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
    );
}

const createStyles = (theme: Theme) => {
    const { Spacing, FontFamily, FontSize, Color } = theme.vars;


    return StyleSheet.create({
        ...theme.styles,
        coinListItemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: Spacing.base
        },
        symbol: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base,
            fontWeight: 'bold',
            color: Color.baseContrast
        },
        balance: {
            fontFamily: FontFamily.sans,
            fontSize: FontSize.base,
            color: Color.baseContrast
        },
        progressBar: {
            backgroundColor: Color.error,
            height: 10,
            position: 'absolute',
            bottom: 0,
            borderRadius: 5,
            width: '100%', 
        },
        progressBarPerc: {
            height: '100%',
            borderRadius: 5,
            backgroundColor: Color.success
        },
        container: {
            backgroundColor: Color.base
        },
        leftContainer: {
            flexDirection: 'row', 
            columnGap: Spacing.base, 
            alignItems: 'center'
        },
        progressBarContainer: {
            marginHorizontal: Spacing.base,
            marginBottom: Spacing.base
        }
    });
}