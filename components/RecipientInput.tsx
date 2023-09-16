import { useI18n, useTheme } from "../hooks";
import { getContact } from "../lib/utils";
import AccountAvatar from "./AccountAvatar";
import { View } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import TextInputContainer from "./TextInputContainer";
import Address from "./Address";

export default (props: {
    value?: string,
    onChange?: Function
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const contact = props.value ? getContact(props.value) : undefined;
    const i18n = useI18n();

    const _select = async () => {
        const value: any = await SheetManager.show("recipient", {
            payload: {
                selected: props.value
            },
        });

        if (value?.address && props.onChange) {
            props.onChange(value.address);
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
                        props.value &&
                        <AccountAvatar size={48} address={props.value} />
                    }
                    {
                        props.value &&
                        <View>
                            {
                                contact?.name &&
                                <Text>{contact.name}</Text>
                            }
                            <Address address={props.value}></Address>
                        </View>
                    }
                </View>

            </TouchableWithoutFeedback>
        </TextInputContainer>
    );
}