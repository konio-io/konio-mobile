import * as React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import {
    createDrawerNavigator,
    DrawerItem,
} from '@react-navigation/drawer';
import { useCurrentAddress, useI18n, useTheme, useAccounts, useLockState, useAppState, useAutolock, useWC, useAccount } from '../hooks';
import { AccountAvatar, Logo, Separator, Link, Address, WcLogo } from '../components';
import { logError, refreshCoins, refreshMana, refreshWCActiveSessions, setCurrentAccount, setWCPendingProposal, setWCPendingRequest, showToast, walletConnectAcceptRequest, walletConnectInit, walletConnectPair } from '../actions';
import Root from './Root';
import { AntDesign, Feather } from '@expo/vector-icons';
import type { Theme } from '../types/store';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import { WC_SECURE_METHODS } from '../lib/Constants';
import NetInfo from '@react-native-community/netinfo';
import { SignClientTypes } from "@walletconnect/types";

const Drawer = createDrawerNavigator();
export default () => {

    const i18n = useI18n();
    const lock = useLockState();
    const nextAppState = useAppState();
    const [dateLock, setDateLock] = useState(0);
    const autoLock = useAutolock();
    const WC = useWC();
    const [connectionAvailable, setConnectionAvailable] = useState(true);

    //Refresh coins and mana on init
    useEffect(() => {
        refreshCoins({ balance: true, price: true });
        refreshMana();
    }, [])

    //intercept network state change on init
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (connectionAvailable === false && state.isConnected === true) {
                showToast({
                    type: 'success',
                    text1: i18n.t('you_online')
                });
                refreshWCActiveSessions();
            }
            else if (state.isConnected !== true) {
                showToast({
                    type: 'error',
                    text1: i18n.t('you_offline'),
                    text2: i18n.t('check_connection')
                });
            }

            setConnectionAvailable(state.isConnected === true ? true : false);
        });

        return unsubscribe;
    }, []);

    //intercept lock
    useEffect(() => {
        if (lock.get() === true) {
            setDateLock(0); //ios
            setTimeout(() => {
                SheetManager.show('unlock');
            }, 100);
        }
    }, [lock]);

    //intercept autolock
    useEffect(() => {
        if (autoLock > -1) {
            if (nextAppState === 'background') {
                setDateLock(Date.now() + autoLock + 1000);
            }
            else if (nextAppState === 'active') {
                if (dateLock > 0 && Date.now() > dateLock) {
                    lock.set(true);
                }
            }
        }
    }, [nextAppState, autoLock]);

    //intercept wc_proposal
    useEffect(() => {
        if (lock.get() === true) {
            return;
        }

        const pendingProposal = WC.pendingProposal;
        if (!pendingProposal) {
            return;
        }

        const proposal = Object.assign({}, pendingProposal);

        SheetManager.show('wc_proposal', { payload: { proposal } });
    }, [lock, WC.pendingProposal]);

    //intercept wc_request
    useEffect(() => {
        if (lock.get() === true) {
            return;
        }

        const pendingRequest = WC.pendingRequest;
        if (!pendingRequest) {
            return;
        }

        const request = Object.assign({}, pendingRequest);

        const method = request.params.request.method;
        if (!WC_SECURE_METHODS.includes(method)) {
            walletConnectAcceptRequest(request)
                .catch(e => {
                    logError(e);
                    showToast({
                        type: 'error',
                        text1: i18n.t('dapp_request_error', { method }),
                        text2: i18n.t('check_logs')
                    })
                });
            return;
        }

        SheetManager.show('wc_request', { payload: { request } });
    }, [lock, WC.pendingRequest]);

    //intercept walletconnect wallet/uri set
    useEffect(() => {
        if (WC.wallet && WC.uri) {
            walletConnectPair(WC.uri)
                .then(() => {
                    console.log('wc_pair: paired');
                })
                .catch(e => {
                    logError(e);
                    showToast({
                        type: 'error',
                        text1: i18n.t('pairing_error'),
                        text2: i18n.t('check_logs')
                    });
                });
        }
    }, [WC.uri, WC.wallet]);

    //intercept walletconnect set and subscribe events
    useEffect(() => {
        const wallet = WC.wallet;
        if (wallet) {
            console.log('wc_register_events');

            const onSessionProposal = (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
                console.log('wc_proposal', proposal);
                setWCPendingProposal(proposal);
            }

            const onSessionRequest = async (request: SignClientTypes.EventArguments["session_request"]) => {
                console.log('wc_request', request);
                setWCPendingRequest(request);
            }

            wallet.on("session_proposal", onSessionProposal);
            wallet.on("session_request", onSessionRequest);
            wallet.on("session_delete", () => {
                refreshWCActiveSessions();
            });
        }
    }, [WC.wallet]);

    //init walletconnect on init
    useEffect(() => {
        walletConnectInit();
    }, []);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false
            }}
        >
            <Drawer.Screen name="Root" component={Root} />
        </Drawer.Navigator>
    );
}

const DrawerContent = (props: any) => {
    const { navigation } = props;
    const accounts = useAccounts();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const currentAddress = useCurrentAddress();
    const insets = useSafeAreaInsets();
    const currentAccount = useAccount(currentAddress);

    return (
        <View style={{ ...styles.flex1, paddingTop: insets.top }}>

            {
                currentAccount &&
                <View style={styles.currentAccountContainer}>
                    <AccountAvatar size={48} address={currentAccount.address} />
                    <View>
                        <Text style={styles.textLarge}>{currentAccount.name}</Text>
                        <Address address={currentAccount.address} copiable={true} />
                    </View>
                </View>
            }

            <ScrollView>
                <Separator />

                {Object.values(accounts).map(account => account.address !== currentAddress &&
                    <DrawerItem
                        labelStyle={styles.text}
                        key={account.address}
                        label={account.name}
                        icon={() => <AccountAvatar size={28} address={account.address} />}
                        onPress={() => {
                            setCurrentAccount(account.address);
                            navigation.navigate('Root', {
                                screen: 'Account'
                            });
                        }}
                    />
                )}

                <DrawerItem
                    labelStyle={styles.text}
                    label={i18n.t('add_account')}
                    icon={({ size, color }) => <View style={styles.drawerIconContainer}><AntDesign name="plus" size={size} color={color} /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'NewAccount'
                        });
                    }}
                />

                <DrawerItem
                    labelStyle={styles.text}
                    label={i18n.t('import_account')}
                    icon={({ size, color }) => <View style={styles.drawerIconContainer}><Feather name="download" size={size} color={color} /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'ImportAccount'
                        });
                    }}
                />

                <DrawerItem
                    labelStyle={styles.text}
                    label='WalletConnect'
                    icon={({ size }) => <View style={styles.drawerIconContainer}><WcLogo /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'WalletConnect',
                            params: {
                                screen: 'WcSessions'
                            }
                        });
                    }}
                />

                <DrawerItem
                    labelStyle={styles.text}
                    label={i18n.t('settings')}
                    icon={({ size, color }) => <View style={styles.drawerIconContainer}><AntDesign name="setting" size={size} color={color} /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'Settings'
                        });
                    }}
                />

                <DrawerItem
                    labelStyle={styles.text}
                    label={i18n.t('faq')}
                    icon={({ size, color }) => <View style={styles.drawerIconContainer}><AntDesign name="questioncircleo" size={size} color={color} /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'Faq'
                        });
                    }}
                />

                <DrawerItem
                    labelStyle={styles.text}
                    label={i18n.t('about')}
                    icon={({ size, color }) => <View style={styles.drawerIconContainer}><AntDesign name="infocirlceo" size={size} color={color} /></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'About'
                        });
                    }}
                />
            </ScrollView>

            <View style={styles.drawerFooterContainer}>
                <Logo width={150} height={34} />

                <View style={styles.authorContainer}>
                    <Text style={styles.textVersion}>v{Constants.expoConfig?.version}</Text>
                    <Link text="https://konio.io" onPress={() => Linking.openURL('https://konio.io')} />
                </View>
            </View>

        </View>
    )
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        drawerContentContainer: {
            flex: 1,
            justifyContent: 'space-between'
        },
        drawerFooterContainer: {
            marginVertical: Spacing.base,
            alignItems: 'center',
            rowGap: Spacing.base
        },
        authorContainer: {
            rowGap: Spacing.small,
            justifyContent: 'center'
        },
        textVersion: {
            ...theme.styles.textCenter,
            ...theme.styles.text,
            fontWeight: 'bold'
        },
        drawerIconContainer: {
            alignItems: 'center',
            width: 28
        },
        currentAccountContainer: {
            padding: Spacing.base,
            flexDirection: 'row',
            columnGap: Spacing.base,
            alignItems: 'center'
        }
    });
};