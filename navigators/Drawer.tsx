import * as React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import {
    createDrawerNavigator,
    DrawerItem,
} from '@react-navigation/drawer';
import { useCurrentAddress, useI18n, useTheme, useAccounts, useWalletConnectHandler } from '../hooks';
import { AccountAvatar, Logo, Separator, Link, Address, WcLogo } from '../components';
import { refreshCoins, refreshMana, setCurrentAccount, walletConnectInit } from '../actions';
import Root from './Root';
import { AntDesign, Feather } from '@expo/vector-icons';
import type { Theme } from '../types/store';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';

const Drawer = createDrawerNavigator();
export default () => {

    //Init
    useEffect(() => {
        refreshCoins({ balance: true, price: true });
        refreshMana();
    }, [])

    useWalletConnectHandler();

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
    const accounts = useAccounts().get();
    const i18n = useI18n();
    const theme = useTheme();
    const { Border, Color } = theme.vars;
    const styles = createStyles(theme);
    const currentAddress = useCurrentAddress();
    const insets = useSafeAreaInsets();
    const currentAccount = accounts[currentAddress.get()];

    return (
        <View style={{ ...styles.flex1, paddingTop: insets.top }}>

            <View style={styles.currentAccountContainer}>
                <AccountAvatar size={48} address={currentAccount.address} />
                <View>
                    <Text style={styles.textLarge}>{currentAccount.name}</Text>
                    <Address address={currentAccount.address} copiable={true} />
                </View>
            </View>

            <ScrollView>
                <Separator />

                {Object.values(accounts).map(account => account.address !== currentAddress.get() &&
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