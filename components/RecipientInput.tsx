import { useI18n, useTheme } from "../hooks";
import Avatar from "./Avatar";
import { View, TouchableWithoutFeedback } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import TextInputContainer from "./TextInputContainer";
import Address from "./Address";
import { ContactStore } from "../stores";

export default (props: {
    value?: string,
    onChange?: Function
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const contact = props.value ? ContactStore.getters.getContact(props.value) : undefined;
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
        <TouchableWithoutFeedback onPress={() => _select()}>
            <View>
                <TextInputContainer note={i18n.t('recipient')}>

                    <View style={{ ...styles.directionRow, ...styles.columnGapSmall, minHeight: 60 }}>

                        {
                            props.value &&
                            <Avatar size={48} address={props.value} />
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

                </TextInputContainer>
            </View>
        </TouchableWithoutFeedback>
    );
}