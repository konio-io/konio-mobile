import { useI18n, useTheme } from "../hooks";
import Avatar from "./Avatar";
import { View, TouchableWithoutFeedback } from "react-native";
import Text from './Text';
import { SheetManager } from "react-native-actions-sheet";
import TextInputContainer from "./TextInputContainer";
import Address from "./Address";
import { AccountStore, ContactStore } from "../stores";
import { useEffect, useState } from "react";

export default (props: {
    value?: string,
    onChange?: Function
}) => {
    const theme = useTheme();
    const styles = theme.styles;
    const [name, setName] = useState('');
    const i18n = useI18n();

    useEffect(() => {
        if (props.value) {
            const contactName = ContactStore.state.nested(props.value)?.name?.get()
                || AccountStore.state.nested(props.value)?.name?.get();

            if (contactName) {
                setName(contactName);
            }
        }
    }, [props.value])


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
                                    name &&
                                    <Text>{name}</Text>
                                }
                                <Address address={props.value} length={10}/>
                            </View>
                        }
                    </View>

                </TextInputContainer>
            </View>
        </TouchableWithoutFeedback>
    );
}