import { View } from 'react-native';
import { Screen, Button, Text, AccountAvatar, ListItemSelected, DrawerToggler, AddressListItem, Link, TextInputActionPaste, TextInputAction, TextInput } from '../components';
import { useTheme, useI18n, useAccounts, useAccount, useTransactions, useAddressbook, useContact, useCurrentAddress, useKapAddress, useKapName, useSearchAddress } from '../hooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawToNavigationProp, WithdrawToRouteProp } from '../types/navigation';
import { refreshKap, showToast } from '../actions';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { utils } from 'koilib';
import { ScrollView } from 'react-native-gesture-handler';
import { SheetManager } from "react-native-actions-sheet";
import { rgba } from '../lib/utils';

export default () => {
    const route = useRoute<WithdrawToRouteProp>();
    const navigation = useNavigation<WithdrawToNavigationProp>();
    const theme = useTheme();
    const styles = theme.styles;
    const i18n = useI18n();
    const address = useHookstate('');

    useEffect(() => {
        address.set(route.params.to ?? '');
    }, [route.params]);

    useEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler />)
        });
    }, [navigation]);

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
            <View style={styles.paddingBase}>
                <To value={address.get()} onChange={(v: string) => address.set(v)} />
            </View>

            <ScrollView>
                <RecentList onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />

                <AccountList onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />

                <View style={styles.paddingVerticalBase}>
                    <View style={styles.paddingHorizontalBase}>
                        <Text style={styles.sectionTitle}>{i18n.t('addressbook')}</Text>
                    </View>

                    <Addressbook onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />
                </View>
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
    const navigation = useNavigation<WithdrawToNavigationProp>();
    const address = useHookstate('');
    const theme = useTheme();
    const styles = theme.styles;
    const { Color } = theme.vars;
    const i18n = useI18n();

    const searchAddress = useHookstate('');
    const name = useHookstate('nome');
    const contact = useSearchAddress(searchAddress.get());
    const loading = useHookstate(false);
    const editable = useHookstate(true);
    const addable = useHookstate(false);

    useEffect(() => {
        if (contact) {
            name.set(contact.name);
            address.set(contact.address);
            addable.set(contact.addable);
        }
    }, [searchAddress, contact]);

    useEffect(() => {
        props.onChange(address.get());
    }, [address]);

    useEffect(() => {
        searchAddress.set(props.value);
    }, [props.value]);

    const onStopWriting = () => {
        if (searchAddress.get()) {
            loading.set(true);
            editable.set(false);

            refreshKap(searchAddress.get())
                .then(() => {
                    loading.set(false);
                    editable.set(true);
                })
                .catch(e => {
                    loading.set(false);
                    editable.set(true);
                });
        }
    };

    return (
        <View>
            {!address.get() &&
                <TextInput
                    multiline={true}
                    autoFocus={true}
                    style={{ fontSize: 12 }}
                    value={searchAddress.get()}
                    onChangeText={(v: string) => { searchAddress.set(v) }}
                    onStopWriting={onStopWriting}
                    loading={loading.get()}
                    placeholder={i18n.t('select_recipient')}
                />
            }

            {address.get() &&
                <View style={{ ...styles.textInputContainer, ...styles.rowGapSmall }}>
                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                        <View style={{ marginTop: 2 }}>
                            <Feather size={18} name="chevron-right" color={rgba(Color.baseContrast, 0.5)} />
                        </View>

                        <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                            <AccountAvatar size={40} address={address.get()} />
                            <View>
                                {
                                    name.get() &&
                                    <Text>{name.get()}</Text>
                                }
                                <Text style={styles.textSmall}>{address.get()}</Text>
                            </View>
                        </View>

                        <TextInputAction
                            onPress={() => {
                                address.set('');
                                searchAddress.set('');
                            }}
                            icon={(<Feather name="x" />)}
                        />

                    </View>

                    {addable.get() &&
                        <Button
                            type='secondary'
                            title={i18n.t('add_to_addressbook')}
                            icon={<Feather name="plus" />}
                            onPress={() => navigation.navigate('NewContact', { address: address.get() })}
                        />
                    }
                </View>
            }
        </View>
    )
}

const RecentList = (props: {
    onPressItem: Function,
    selected: string
}) => {
    const currentAddress = useCurrentAddress();
    const transactions = useTransactions().get();
    const { styles } = useTheme();
    const i18n = useI18n();
    const result = Object.values(transactions)
        .filter(t => t.type === 'WITHDRAW')
        .sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))
        .slice(0, 5)
        .map(t => t.to)
        .filter(to => to !== currentAddress.get());

    const data = [...new Set(result)];

    return (
        <View style={styles.paddingVerticalBase}>
            {
                data.length > 0 &&
                <View style={styles.paddingHorizontalBase}>
                    <Text style={styles.sectionTitle}>{i18n.t('recents')}</Text>
                </View>
            }
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
    const accounts = useAccounts().get();
    const { styles } = useTheme();
    const i18n = useI18n();
    const result = Object.values(accounts)
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(t => t.address)
        .filter(address => address !== currentAddress.get());

    const data = [...new Set(result)];

    return (
        <View style={styles.paddingVerticalBase}>
            {
                data.length > 0 &&
                <View style={styles.paddingHorizontalBase}>
                    <Text style={styles.sectionTitle}>{i18n.t('accounts')}</Text>
                </View>
            }
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
                <ToListItem key={item} address={item} selected={props.selected === item} onPress={(address: string) => props.onPressItem(address)} />
            )}

            <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
                <Link text={i18n.t('new_contact')} onPress={() => navigation.navigate('NewContact', {})} />
            </View>
        </View>
    );
}

const ToListItem = (props: {
    address: string,
    onPress: Function,
    selected: boolean
}) => {

    const account = useAccount(props.address);
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
            ItemComponent={<AddressListItem address={props.address} name={name} />}
            selected={props.selected}
            onPress={() => props.onPress(props.address)}
            onLongPress={() => SheetManager.show('addressbook_item', { payload: { address: props.address } })}
        />
    )
}