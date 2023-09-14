import ActionSheet, { SheetManager, SheetProps } from "react-native-actions-sheet";
import Text from './Text';
import Button from "./Button";
import { View, ScrollView } from "react-native";
import { useAccount, useAccounts, useAddressbook, useContact, useCurrentAddress, useI18n, useTheme } from "../hooks";
import { useHookstate } from "@hookstate/core";
import ButtonCircle from "./ButtonCircle";
import ListItemSelected from "./ListItemSelected";
import AddressListItem from "./AddressListItem";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import TextInput from "./TextInput";
import TextInputActionPaste from "./TextInputActionPaste";
import { WithdrawAssetNavigationProp } from "../types/navigation";

export default (props: SheetProps<{ selected: string }>) => {

    const i18n = useI18n();
    const theme = useTheme();
    const styles = theme.styles;
    const address = useHookstate(props.payload?.selected ?? '');

    const _close = () => {
        SheetManager.hide(props.sheetId);
    }

    const _confirm = () => {
        if (address.get()) {
            SheetManager.hide(props.sheetId, {
                payload: address.get(),
            });
        }
    }

    return (
        <ActionSheet
            id={props.sheetId}
            closeOnTouchBackdrop={false}
            containerStyle={{ ...styles.paddingBase, ...styles.rowGapMedium }}
        >
            <ScrollView>
                <TextInput
                    multiline={true}
                    value={address.get()}
                    onChangeText={(v: string) => address.set(v)}
                    actions={(
                        <TextInputActionPaste state={address} />
                    )}
                />

                <AccountList onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />

                <View style={styles.paddingVerticalBase}>
                    <View style={styles.paddingHorizontalBase}>
                        <Text style={styles.sectionTitle}>{i18n.t('addressbook')}</Text>
                    </View>

                    <Addressbook onPressItem={(addr: string) => address.set(addr)} selected={address.get()} />
                </View>
            </ScrollView>

            <View style={{ ...styles.directionRow, ...styles.columnGapBase }}>
                <Button style={{ flex: 1 }} onPress={() => _close()} type="secondary" title={i18n.t('cancel')} />
                <Button style={{ flex: 1 }} title={i18n.t('confirm')} onPress={() => _confirm()}/>
            </View>

        </ActionSheet>
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
    const theme = useTheme();
    const styles = theme.styles;
    const navigation = useNavigation<WithdrawAssetNavigationProp>();
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
                <ButtonCircle
                    onPress={() => {
                        SheetManager.hide('recipient');
                        navigation.navigate('NewContact', {address: props.selected ?? ''})
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