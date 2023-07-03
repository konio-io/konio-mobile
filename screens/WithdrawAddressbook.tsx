import { Screen, ListItemSelected, AddressbookListItem, Link } from "../components"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useAddressbook, useI18n, useTheme } from "../hooks";
import { SectionList, View, StyleSheet } from "react-native";
import { Text } from "../components";
import { WithdrawAddressbookNavigationProp, WithdrawAddressbookRouteProp } from "../types/navigation";
import { SheetManager } from "react-native-actions-sheet";
import type { AddressbookItem, Theme } from "../types/store";

export default () => {
    const addressbook = useAddressbook();
    const filteredAddressBook = Object.values(addressbook.get());
    const groupedAddressBook: Record<string, {
        title: string,
        data: Array<AddressbookItem>
    }> = {};
    for (const addressItem of filteredAddressBook) {
        const letter = addressItem.name.charAt(0).toUpperCase();
        if (!groupedAddressBook[letter]) {
            groupedAddressBook[letter] = {
                title: letter,
                data: []
            };
        }
        groupedAddressBook[letter].data.push(addressItem);
    }

    

    const data = Object.values(groupedAddressBook)
        .sort((a, b) => a.title > b.title ? 1 : -1);
    
    for (const index in data) {
        data[index].data = data[index].data.sort((a: AddressbookItem, b: AddressbookItem) => a.name > b.name ? 1 : -1);
    }

    return (
        <Screen>
            <SectionList
                sections={data}
                renderItem={({ item }) => <ListItem address={item.address}/>}
                renderSectionHeader={({ section: { title } }) => <SectionHeader title={title} />}
            />
            <Footer />
        </Screen>
    );
}

const SectionHeader = (props: {
    title: string
}) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{props.title}</Text>
            </View>
        </View>
    );
}

const ListItem = (props: {
    address: string
}) => {
    const navigation = useNavigation<WithdrawAddressbookNavigationProp>();
    const route = useRoute<WithdrawAddressbookRouteProp>();
    const selected = route.params.selected === props.address;

    return (
        <ListItemSelected
            ItemComponent={() => <AddressbookListItem address={props.address} />}
            selected={selected}
            onPress={() => navigation.navigate('WithdrawTo', {to: props.address, contractId: route.params.contractId})}
            onLongPress={() => SheetManager.show('addressbook_item', {payload: {address: props.address}})}
        />
    )
}

const Footer = () => {
    const navigation = useNavigation<WithdrawAddressbookNavigationProp>();
    const i18n = useI18n();
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.addMoreContainer}>
            <Link text={i18n.t('new_addressbook_item')} onPress={() => navigation.navigate('NewAddressbookItem')} />
        </View>
    );
};

const createStyles = (theme: Theme) => {
    const { Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        sectionContainer: { 
            paddingHorizontal: Spacing.base, 
            paddingVertical: Spacing.small 
        },
        sectionTitle: {
            ...theme.styles.text, 
            fontWeight: 'bold'
        }
    });
}