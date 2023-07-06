import { Pressable, View, StyleSheet } from 'react-native';
import { Screen, TextInput, Button, Text, AccountAvatar, ListItemSelected, DrawerToggler, AddressListItem, Link } from '../components';
import { useTheme, useI18n, useWallets, useWallet, useTransactions, useAddressbook, useContact, useCurrentAddress } from '../hooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawToNavigationProp, WithdrawToRouteProp } from '../types/navigation';
import { showToast } from '../actions';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { utils } from 'koilib';
import type { Theme } from '../types/store';
import { ScrollView } from 'react-native-gesture-handler';
import { SheetManager } from "react-native-actions-sheet";

export default () => {
    const route = useRoute<WithdrawToRouteProp>();
    const navigation = useNavigation<WithdrawToNavigationProp>();
    const theme = useTheme();
    const styles = createStyles(theme);
    const i18n = useI18n();
    const address = useHookstate('');
    const currentAddress = useCurrentAddress();

    useEffect(() => {
        address.set(route.params.to ?? '');
    }, [route.params]);

    useEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />)
        });
    }, [navigation]);

    useEffect(() => {
        address.set('');
    }, [currentAddress]);

    const next = () => {
        if (!address.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_destination')
            });
            return;
        }

        try {
            const check = utils.isChecksumAddress(address.get());
            if (!check) {
                throw "Invalid address";
            }
        } catch (e) {
            showToast({
                type: 'error',
                text1: i18n.t('invalid_address')
            });
            return;
        }

        navigation.navigate('WithdrawAmount', { contractId: route.params.contractId, to: address.get() });
    };

    return (
        <Screen>
            <View style={styles.toContainer}>
                <To value={address.get()} onChange={(v: string) => address.set(v)} />
            </View>

            <ScrollView>
                <View style={styles.paddingBase}>
                    <Text style={styles.sectionTitle}>{i18n.t('recents')}</Text>
                </View>

                <RecentList onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />

                <View style={styles.paddingBase}>
                    <Text style={styles.sectionTitle}>{i18n.t('accounts')}</Text>
                </View>

                <AccountList onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />

                <View style={styles.paddingBase}>
                    <Text style={styles.sectionTitle}>{i18n.t('addressbook')}</Text>
                </View>

                <Addressbook onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />
            </ScrollView>

            <View style={styles.paddingBase}>
                <Button
                    title={i18n.t('next')}
                    onPress={next}
                    icon={<Feather name="arrow-right" />}
                />
            </View>
        </Screen>
    )
}

const To = (props: {
    value: string,
    onChange: Function
}) => {
    const address = useHookstate('');
    const name = useHookstate('');

    const account = useWallet(address.get());
    const contact = useContact(address.get());

    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);
    const { Color } = theme.vars;

    useEffect(() => {
        props.onChange(address.get());
    }, [address]);

    useEffect(() => {
        address.set(props.value);
    }, [props.value]);

    useEffect(() => {
        if (account.ornull) {
            name.set(account.ornull.name.get());
        }
        else if (contact.ornull) {
            name.set(contact.ornull.name.get());
        }
        else {
            name.set('');
        }
    }, [account, contact])

    return (
        <View>
            <View style={styles.toInputAddressContainer}>
                {
                    address.get() &&
                    <AccountAvatar size={55} address={address.get()} />
                }
                <View style={{ flex: 1 }}>
                    {name.get() &&
                        <Text style={styles.textMedium}>{name.get()}</Text>
                    }
                    <TextInput
                        multiline={true}
                        autoFocus={true}
                        style={{ ...styles.addressText, ...styles.addressContainer }}
                        value={address.get()}
                        onChangeText={(v: string) => { address.set(v) }}
                        placeholder={i18n.t('select_recipient')}
                    />
                </View>
            </View>
        </View>
    )
}

const RecentList = (props: {
    onPressItem: Function,
    selected: string
}) => {
    const currentAddress = useCurrentAddress();
    const transactions = useTransactions().get();
    const result = Object.values(transactions)
        .filter(t => t.type === 'WITHDRAW')
        .sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))
        .slice(0, 5)
        .map(t => t.to)
        .filter(to => to !== currentAddress.get());

    const data = [...new Set(result)];

    return (
        <View>
            {data.map(item =>
                <ToListItem key={item} address={item} selected={props.selected === item} onPress={(address: string) => props.onPressItem(address)} />
            )}
        </View>
    );
}

const AccountList = (props: {
    onPressItem: Function,
    selected: string
}) => {
    const currentAddress = useCurrentAddress();
    const wallets = useWallets().get();
    const result = Object.values(wallets)
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(t => t.address)
        .filter(address => address !== currentAddress.get());

    const data = [...new Set(result)];

    return (
        <View>
            {data.map(item =>
                <ToListItem key={item} address={item} selected={props.selected === item} onPress={(address: string) => props.onPressItem(address)} />
            )}
        </View>
    );
}

const Addressbook = (props: {
    onPressItem: Function,
    selected: string
}) => {
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const navigation = useNavigation<WithdrawToNavigationProp>();
    const currentAddress = useCurrentAddress();
    const addressBook = useAddressbook().get();
    const result = Object.values(addressBook)
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(t => t.address)
        .filter(address => address !== currentAddress.get());

    const data = [...new Set(result)];

    return (
        <View>
            {data.map(item =>
                <ToListItem address={item} selected={props.selected === item} onPress={(address: string) => props.onPressItem(address)} />
            )}

            <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
                <Link text={i18n.t('new_contact')} onPress={() => navigation.navigate('NewContact')} />
            </View>
        </View>
    );
}

const ToListItem = (props: {
    address: string,
    onPress: Function,
    selected: boolean
}) => {

    const account = useWallet(props.address);
    const contact = useContact(props.address);
    let name = '';

    if (account.get()) {
        name = account.name.get();
    }
    else if (contact.get()) {
        name = contact.name.get();
    }

    return (
        <ListItemSelected
            ItemComponent={() => <AddressListItem address={props.address} name={name} />}
            selected={props.selected}
            onPress={() => props.onPress(props.address)}
            onLongPress={() => SheetManager.show('addressbook_item', { payload: { address: props.address } })}
        />
    )
}

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        toContainer: {
            padding: Spacing.base,
            rowGap: Spacing.small
        },
        toInputContainer: {
            ...theme.styles.textInput,
            rowGap: Spacing.small
        },
        toInputAddressContainer: {
            flexDirection: 'row',
            columnGap: Spacing.small,
            alignItems: 'center'
        },
        toInputIconsContainer: {
            flexDirection: 'row',
            columnGap: Spacing.small
        }
    });
}