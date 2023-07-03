import { FlatList, Pressable, View, StyleSheet } from 'react-native';
import { Screen, TextInput, Button, Text, AccountAvatar, ListItemSelected, Separator, AccountListItem } from '../components';
import { useTheme, useI18n, useWallets, useWallet, useTransactions, useAddressbook, useAddressbookItem, useCurrentAddress } from '../hooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawToNavigationProp, WithdrawToRouteProp } from '../types/navigation';
import { showToast } from '../actions';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { utils } from 'koilib';
import type { Theme } from '../types/store';


export default () => {
    const route = useRoute<WithdrawToRouteProp>();
    const navigation = useNavigation<WithdrawToNavigationProp>();
    const theme = useTheme();
    const styles = createStyles(theme);
    const i18n = useI18n();
    const address = useHookstate('');

    useEffect(() => {
        address.set(route.params.to ?? '');
    }, [route.params.to]);

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

            <View style={styles.screenFooter}>
                <Text style={styles.textSmall}>{i18n.t('recents')}</Text>
            </View>

            <RecentList onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />

            <View style={styles.screenFooter}>
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
    const addressBookItem = useAddressbookItem(address.get());

    const i18n = useI18n();
    const navigation = useNavigation<WithdrawToNavigationProp>();
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
        else if (addressBookItem.ornull) {
            name.set(addressBookItem.ornull.name.get());
        }
        else {
            name.set('');
        }
    }, [account, addressBookItem])

    return (
        <View style={styles.toInputContainer}>

            <View style={styles.toInputAddressContainer}>
                {
                    address.get() &&
                    <AccountAvatar size={36} address={address.get()} />
                }

                <View style={{ flex: 1 }}>
                    {name.get() &&
                        <Text>{name.get()}</Text>
                    }
                    <TextInput
                        multiline={true}
                        autoFocus={true}
                        style={{ ...styles.addressText, ...styles.addressContainer }}
                        value={address.get()}
                        onChangeText={(v: string) => { address.set(v) }}
                    />
                </View>
            </View>

            <View style={{alignItems: 'flex-end'}}>
                <View style={styles.toInputIconsContainer}>
                    <Pressable onPress={() => navigation.navigate('WithdrawSelectTo', { selected: address.get() })}>
                        <AntDesign name="wallet" size={22} color={Color.baseContrast} />
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('WithdrawAddressbook', { selected: address.get() })}>
                        <Feather name="book-open" size={22} color={Color.baseContrast} />
                    </Pressable>

                    <Pressable onPress={() => showToast({ type: 'info', text1: i18n.t('available_soon') })}>
                        <AntDesign name="qrcode" size={22} color={Color.baseContrast} />
                    </Pressable>
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
    const latestTransactionTo = Object.values(transactions)
        .filter(t => t.type === 'WITHDRAW')
        .sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))
        .slice(0, 5)
        .map(t => t.to);

    const wallets = Object.values(useWallets().get());
    const filteredWallets = wallets.filter(w => latestTransactionTo.includes(w.address) && w.address !== currentAddress.get());

    const addressBook = Object.values(useAddressbook().get());
    const filteredAddressBook = addressBook.filter(a => latestTransactionTo.includes(a.address));

    const data = [...filteredWallets, ...filteredAddressBook];

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => <RecentListItem address={item.address} selected={props.selected === item.address} onPress={(address: string) => props.onPressItem(address)} />}
            ItemSeparatorComponent={() => <Separator />}
        />
    );
}

const RecentListItem = (props: {
    address: string,
    onPress: Function,
    selected: boolean
}) => {

    return (
        <ListItemSelected
            ItemComponent={() => <AccountListItem address={props.address} />}
            selected={props.selected}
            onPress={() => props.onPress(props.address)}
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