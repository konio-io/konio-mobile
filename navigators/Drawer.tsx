import * as React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import {
    createDrawerNavigator,
    DrawerItem,
} from '@react-navigation/drawer';
import { useCurrentAddress, useI18n, useTheme, useAccounts } from '../hooks';
import { AccountAvatar, Logo, Separator, Link, Address, WcLogo } from '../components';
import { setCurrentAccount } from '../actions';
import Root from './Root';
import { AntDesign } from '@expo/vector-icons';
import type { Theme } from '../types/store';
import Constants from 'expo-constants';
import { State } from '@hookstate/core';
import Loading from '../screens/Loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();
export default () => {
    return (
        <Drawer.Navigator
            useLegacyImplementation
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
    const styles = createStyles(theme);
    const currentAddress = useCurrentAddress();
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    const insets = useSafeAreaInsets(); 

    if (!currentAddressOrNull) {
        return <Loading />;
    }

    const currentAccount = accounts[currentAddressOrNull.get()];

    return (
        <View style={{...styles.flex1, paddingTop: insets.top }}>

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
                    label='WalletConnect'
                    icon={({ size }) => <View style={styles.drawerIconContainer}><WcLogo/></View>}
                    onPress={() => {
                        navigation.navigate('Root', {
                            screen: 'WalletConnect',
                            params: {
                                screen: 'WcSessions'
                            }
                        });
                    }}
                />
            </ScrollView>

            <View style={styles.drawerFooterContainer}>
                <Logo width={150} height={34} />

                <View style={styles.authorContainer}>
                    <Text style={styles.textVersion}>v{Constants.manifest?.version}</Text>
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