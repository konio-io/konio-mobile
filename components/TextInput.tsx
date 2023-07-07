import { Pressable, TextInput, View } from 'react-native';
import { useTheme } from '../hooks';
import { rgba } from '../lib/utils';
import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import Text from './Text';

export default (props: any) => {

    const value = useHookstate('');
    useEffect(() => {
        value.set(props.value)
    }, [props.value])

    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    const defaultProps = {
        style: {
            ...styles.flex1,
            ...styles.textInputText
        },
        placeholderTextColor: rgba(Color.baseContrast, 0.3),
    };

    const wprops = {
        ...defaultProps,
        ...props,
        style: {
            ...defaultProps.style,
            ...props.style
        },
        value: value.get(),
        onChangeText: (v: string) => {
            value.set(v)
            props.onChangeText(v)
        }
    };

    return (
        <View>
            <View style={{ ...styles.textInputContainer, ...styles.directionRow, ...styles.alignCenterColumn, ...styles.columnGapSmall }}>
                <Feather size={18} name="chevron-right" color={rgba(Color.baseContrast, 0.5)} />
                <TextInput {...wprops} />

                <View style={{ width: 18 }}>
                    {wprops.value &&
                        <Pressable onPress={() => {
                            wprops.onChangeText('')
                        }}>
                            <Feather size={18} name="x" color={rgba(Color.baseContrast, 0.5)} />
                        </Pressable>
                    }
                </View>
            </View>
            {wprops.note &&
                <View style={{ paddingLeft: 25 }}>
                    <Text style={styles.textSmall}>{wprops.note}</Text>
                </View>
            }
        </View>
    );
}