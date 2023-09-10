import { Alert, View } from 'react-native';
import { Screen, Button, Text, AccountAvatar, ListItemSelected, DrawerToggler, AddressListItem, Link, TextInputActionPaste, TextInputAction, TextInput } from '../components';
import { useTheme, useI18n, useAccounts, useAccount, useAddressbook, useContact, useCurrentAddress } from '../hooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WithdrawToNavigationProp, WithdrawToRouteProp } from '../types/navigation';
import { refreshKap, showToast } from '../actions';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import { utils } from 'koilib';
import { ScrollView } from 'react-native-gesture-handler';
import { SheetManager } from "react-native-actions-sheet";
import { isASCIIString, getContact } from '../lib/utils';

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
        <Screen keyboardDismiss={true}>
            <View style={styles.paddingBase}>
                <To value={address.get()} onChange={(v: string) => address.set(v)} />
            </View>

            <ScrollView>
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
    const i18n = useI18n();

    const name = useHookstate('nome');
    const loading = useHookstate(false);
    const addable = useHookstate(false);
    const isValidAddress = useHookstate(false);
    const searchText = useHookstate('');

    useEffect(() => {
        props.onChange(address.get());
    }, [address]);

    useEffect(() => {
        searchText.set(props.value);
    }, [props.value]);

    const onStopWriting = async () => {
        if (searchText.get()) {
            if (!isASCIIString(searchText.get())) {
                Alert.alert(i18n.t('warning'), i18n.t('homograph_attack_warning'), [
                    { text: i18n.t('ok'), onPress: populateContact },
                ]);
            } else {
                populateContact();
            }
        }
    }

    const populateContact = async () => {
        let contact = getContact(searchText.get());
        if (contact && contact.name) {
            isValidAddress.set(true);
            name.set(contact.name);
            address.set(contact.address);
            addable.set(contact.addable);
        } else {
            await loadKap();
            contact = getContact(searchText.get());
            if (contact) {
                isValidAddress.set(true);
                name.set(contact.name);
                address.set(contact.address);
                addable.set(contact.addable);
            }
        }
    }

    const loadKap = async () => {
        loading.set(true);
        try {
            await refreshKap(searchText.get());
            loading.set(false);
        } catch (e) {
            loading.set(false);
        }
    };

    const cancel = () => {
        name.set('');
        address.set('');
        isValidAddress.set(false);
        addable.set(false);
        searchText.set('');
    };

    return (
        <View>
            {!isValidAddress.get() &&
                <TextInput
                    multiline={true}
                    autoFocus={true}
                    value={searchText.get()}
                    onChangeText={(v: string) => { searchText.set(v) }}
                    onStopWriting={onStopWriting}
                    loading={loading.get()}
                    placeholder={i18n.t('select_recipient')}
                    actions={(
                        <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                            <TextInputAction
                                onPress={() => navigation.navigate('WithdrawToScan')}
                                icon={(<AntDesign name="scan1" />)}
                            />
                            <TextInputActionPaste state={address} />
                        </View>
                    )}
                />
            }

            {isValidAddress.get() &&
                <View style={{ ...styles.textInputContainer, ...styles.rowGapSmall }}>
                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                        <View style={{ ...styles.directionRow, ...styles.columnGapSmall, flexGrow: 1 }}>
                            <AccountAvatar size={40} address={address.get()} />
                            <View>
                                {
                                    name.get() &&
                                    <Text>{name.get()}</Text>
                                }
                                <Text style={styles.textSmall}>{address.get()}</Text>
                            </View>
                        </View>

                        <View style={{ width: 22 }}>
                            <TextInputAction
                                onPress={cancel}
                                icon={(<Feather name="x" />)}
                            />
                        </View>
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