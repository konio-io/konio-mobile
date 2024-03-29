import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData, View } from 'react-native';
import { useTheme } from '../hooks';
import { rgba } from '../lib/utils';
import { Feather } from '@expo/vector-icons';
import React, { ReactElement, useEffect } from 'react';
import TextInputAction from './TextInputAction';
import TextInputContainer from './TextInputContainer';

export default (props: {
    style?: Object,
    containerStyle?: Object,
    loading?: boolean,
    actionX?: ReactElement
    actions?: ReactElement
    note?: string,
    editable?: boolean
    value?: any,
    multiline?: boolean
    onChangeText?: Function
    onStopWriting?: Function,
    textVerticalAlign?: string,
    autoFocus?: boolean
    keyboardType?: any
    placeholder?: string
    textAlign?: any
    secureTextEntry?: boolean,
    numberOfLines?: number,
    onSubmitEditing?: ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
}) => {
2
    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    useEffect(() => {
        if (props.onStopWriting) {
            const timeout = setTimeout(() => {
                if (props.onStopWriting) {
                    props.onStopWriting(props.value);
                }
            }, 2000);

            return () => clearTimeout(timeout)
        }
    }, [props.value]);

    return (
        <TextInputContainer style={props.containerStyle}
            actionX={(
                <View>
                    {props.value && props.editable !== true &&
                        <TextInputAction
                            onPress={() => {
                                if (props.onChangeText) {
                                    props.onChangeText('');
                                }
                            }}
                            icon={(<Feather name="x" />)}
                        />
                    }
                </View>
            )}
            actions={props.actions}
            note={props.note}
            loading={props.loading}
        >
            <TextInput
                style={{
                    ...styles.flex1,
                    ...styles.textInputText,
                    ...props.style
                }}
                placeholderTextColor={rgba(Color.baseContrast, 0.3)}
                value={props.value}
                textAlignVertical="top"
                onChangeText={(v: string) => {
                    if (props.onChangeText) {
                        props.onChangeText(v)
                    }
                }}
                autoFocus={props.autoFocus}
                keyboardType={props.keyboardType}
                placeholder={props.placeholder}
                textAlign={props.textAlign}
                secureTextEntry={props.secureTextEntry}
                multiline={props.multiline}
                numberOfLines={props.numberOfLines}
                onSubmitEditing={props.onSubmitEditing}
            />
        </TextInputContainer>
    );
}