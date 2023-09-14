import { useHookstate } from "@hookstate/core";
import { useI18n, useTheme } from "../hooks";
import { getContact } from "../lib/utils";
import AccountAvatar from "./AccountAvatar";
import { View } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useEffect } from "react";
import TextInputContainer from "./TextInputContainer";
import Address from "./Address";

export default (props: {
    address: string,
    onChange?: Function
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const address = useHookstate('');
    const contact = getContact(address.get());
    const i18n = useI18n();

    useEffect(() => {
        address.set(props.address);
    }, [props.address])

    const _select = async () => {
        const value: string = await SheetManager.show("recipient", {
            payload: {
                selected: address.get()
            },
        });

        if (value) {
            address.set(value);

            if (props.onChange) {
                props.onChange(address.get());
            }
        }
    }

    return (
        <TextInputContainer note={i18n.t('recipient')}>
            <TouchableWithoutFeedback
                onPress={() => _select()}
                containerStyle={{ flexGrow: 1 }}
            >
                <View style={{ ...styles.directionRow, ...styles.columnGapSmall, minHeight: 60 }}>

                    {
                        address.get() &&
                        <AccountAvatar size={48} address={address.get()} />
                    }
                    {
                        address.get() &&
                        <View>
                            {
                                contact?.name &&
                                <Text>{contact.name}</Text>
                            }
                            <Address address={address.get()}></Address>
                        </View>
                    }

                </View>

            </TouchableWithoutFeedback>
        </TextInputContainer>
    );
}