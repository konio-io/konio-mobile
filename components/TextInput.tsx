import { TextInput, View } from 'react-native';
import { useTheme } from '../hooks';
import { rgba } from '../lib/utils';
import { Feather } from '@expo/vector-icons';
import React, { ReactElement, useEffect, useState } from 'react';
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
    numberOfLines?: number
}) => {

    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    if (props.onStopWriting) {
        useEffect(() => {
            const delayDebounceFn = setTimeout(() => {
                if (props.onStopWriting) {
                    props.onStopWriting();
                }
            }, 1000)

            return () => clearTimeout(delayDebounceFn)
        }, [props.value])
    }

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
            />
        </TextInputContainer>
    );
}