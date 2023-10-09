import { SheetManager, SheetProps } from "react-native-actions-sheet";
import { View, ScrollView } from "react-native";
import { useCurrentAccount, useI18n, useTheme } from "../hooks";
import { Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AccountNavigationProp } from "../types/navigation";
import { useState } from "react";
import { AccountStore, ContactStore, NameserverStore } from "../stores";
import { useHookstate } from "@hookstate/core";
import { Text, Button, ButtonCircle, ListItem, AddressListItem, TextInput, TextInputActionPaste, TextInputAction } from '../components';
import ActionSheet from './ActionSheet';

export default (props: SheetProps<{ selected: string }>) => {

    const navigation = useNavigation<AccountNavigationProp>();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const [address, setAddress] = useState(props.payload?.selected ?? '');
    const [loading, setLoading] = useState(false);

    const _confirm = () => {
        if (address) {
            SheetManager.hide(props.sheetId, {
                payload: {
                    address
                }
            });
        }
    };

    const _onChange = (v: string) => {
        setAddress(v);
    };

    const _onStopWriting = (v: string) => {
        if (NameserverStore.getters.validateKapQuery(v) || NameserverStore.getters.validateNicQuery(v)) {
            setLoading(true);
            NameserverStore.getters.getAddress(v)
                .then(addr => {
                    setLoading(false);
                    if (addr) {
                        setAddress(addr);
                        NameserverStore.actions.add(addr, v);
                    }
                })
                .catch(e => {
                    setLoading(false);
                });
        }
    };

    return (
        <ActionSheet
            id={props.sheetId}
            containerStyle={{ ...styles.paddingBase, ...styles.rowGapMedium }}
        >
            <ScrollView>
                <TextInput
                    loading={loading}
                    autoFocus={true}
                    multiline={true}
                    value={address}
                    onChangeText={(v: string) => _onChange(v)}
                    onStopWriting={(v: string) => _onStopWriting(v)}
                    actions={(
                        <View style={{...styles.directionRow, ...styles.columnGapBase}}>
                            <TextInputActionPaste onPaste={(addr: string) => setAddress(addr.trim())} />
                            <TextInputAction
                                icon={(<AntDesign name="scan1" />)}
                                onPress={() => {
                                    SheetManager.hide(props.sheetId);
                                    navigation.navigate('WithdrawToScan');
                                }}
                            />
                        </View>
                    )}
                />

                <AccountList onPressItem={(addr: string) => setAddress(addr)} selected={address} />

                <View style={styles.paddingVerticalBase}>
                    <View style={styles.paddingHorizontalBase}>
                        <Text style={styles.sectionTitle}>{i18n.t('addressbook')}</Text>
                    </View>

                    <Addressbook onPressItem={(addr: string) => setAddress(addr)} selected={address} />
                </View>
            </ScrollView>

            <Button title={i18n.t('confirm')} onPress={() => _confirm()} />

        </ActionSheet>
    );
}

const AccountList = (props: {
    onPressItem: Function,
    selected: string
}) => {
    const accounts = useHookstate(AccountStore.state).get();
    const currentAccount = useCurrentAccount();

    const { styles } = useTheme();
    const i18n = useI18n();
    const result = Object.values(accounts)
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(t => t.address)
        .filter(address => address !== currentAccount.address);

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
                <ToListItem
                    key={item}
                    address={item}
                    selected={props.selected === item}
                    onPress={(address: string) => props.onPressItem(address)}
                />
            )}
        </View>
    );
}

const Addressbook = (props: {
    onPressItem: Function,
    selected: string
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const navigation = useNavigation<AccountNavigationProp>();
    const currentAccount = useCurrentAccount();
    const addressBook = useHookstate(ContactStore.state).get();
    const result = Object.values(addressBook)
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(t => t.address)
        .filter(address => address !== currentAccount.address);

    const data = [...new Set(result)];

    return (
        <View>
            {data.map(item =>
                <ToListItem
                    key={item}
                    address={item}
                    selected={props.selected === item}
                    onPress={(address: string) => props.onPressItem(address)}
                />
            )}

            <View style={{ ...styles.paddingBase, ...styles.alignCenterColumn }}>
                <ButtonCircle
                    onPress={() => {
                        SheetManager.hide('recipient');
                        navigation.navigate('NewContact', { address: props.selected ?? '' })
                    }}
                    icon={(<Feather name="plus" />)}
                    type='secondary'
                />
            </View>
        </View>
    );
}

const ToListItem = (props: {
    address: string,
    onPress: Function,
    selected: boolean
}) => {

    const account = Object.values(AccountStore.state.get()).find(account => account.address === props.address);
    const contact = ContactStore.state.nested(props.address).get();
    let name = '';

    if (account) {
        name = account.name;
    }
    else if (contact) {
        name = contact.name;
    }

    return (
        <ListItem
            content={<AddressListItem address={props.address} name={name} />}
            selected={props.selected}
            onPress={() => props.onPress(props.address)}
            onLongPress={() => SheetManager.show('addressbook_item', { payload: { address: props.address } })}
        />
    )
}