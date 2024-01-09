import * as React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, TouchableOpacity } from 'react-native';
import {
    createDrawerNavigator,
    DrawerItem,
} from '@react-navigation/drawer';
import { useCurrentAccount, useI18n, useTheme } from '../hooks';
import { Avatar, Logo, Separator, Link, Address, WcLogo } from '../components';
import Root from './Root';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import type { Theme } from '../types/ui';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHookstate } from '@hookstate/core';
import AccountStore from '../stores/AccountStore';
import SettingStore from '../stores/SettingStore';
import { rgba } from '../lib/utils';

const Drawer = createDrawerNavigator();
export default () => {
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
    const currentAccount = useCurrentAccount();
    const accounts = useHookstate(AccountStore.state).get();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();

    return (
        <View style={{ ...styles.flex1, paddingTop: insets.top }}>

            {
                currentAccount &&
                <View style={styles.currentAccountContainer}>
                    <Avatar size={48} address={currentAccount.address} />
                    <View>
                        <Text style={styles.textMedium}>{currentAccount.name}</Text>
                        <Address address={currentAccount.address} copiable={true} />
                    </View>
                </View>
            }

            <ScrollView>
                <Separator />

                {Object.values(accounts).map(account => account.id !== currentAccount.id &&
                    <DrawerItem
                        labelStyle={styles.text}
                        key={account.id}
                        label={account.name}
                        icon={() => <Avatar size={28} address={account.id} />}
                        onPress={() => {
                            SettingStore.actions.setCurrentAccount(account.id);
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
                <View style={styles.alignCenterColumn}>
                    <Logo width={74} height={74} />

                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall, alignItems: 'baseline' }}>
                        <Link text="konio.io" onPress={() => Linking.openURL('https://konio.io')} />
                        <Text style={styles.textVersion}>v{Constants.expoConfig?.version}</Text>
                    </View>
                </View>

                <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/konio_io')}>
                        <FontAwesome5 name="twitter" size={24} color={rgba(theme.vars.Color.baseContrast, 0.4)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://t.me/konio_io')}>
                        <FontAwesome5 name="telegram" size={24} color={rgba(theme.vars.Color.baseContrast, 0.4)} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://discord.gg/pUD4b3UDbQ')}>
                        <FontAwesome5 name="discord" size={24} color={rgba(theme.vars.Color.baseContrast, 0.4)} />
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    )
}


const createStyles = (theme: Theme) => {
    const { Spacing, FontSize } = theme.vars;

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
        textVersion: {
            ...theme.styles.textCenter,
            ...theme.styles.text,
            fontSize: FontSize.small
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