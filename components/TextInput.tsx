import { TextInput, View } from 'react-native';
import { useTheme } from '../hooks';
import { rgba } from '../lib/utils';
import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { useHookstate } from '@hookstate/core';
import Text from './Text';
import TextInputAction from './TextInputAction';

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
        textAlignVertical: "top", //android multiline vertical align issue
        value: value.get(),
        onChangeText: (v: string) => {
            value.set(v)
            props.onChangeText(v)
        }
    };

    return (

        <View style={{ ...styles.textInputContainer, ...props.styleContainer }}>
            <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                <View style={{ marginTop: 2 }}>
                    <Feather size={18} name="chevron-right" color={rgba(Color.baseContrast, 0.5)} />
                </View>

                <TextInput {...wprops} />

                {wprops.value &&
                    <TextInputAction
                        onPress={() => wprops.onChangeText('')}
                        icon={(<Feather name="x" />)}
                    />
                }
            </View>
            {wprops.actions &&
                <View style={styles.alignEndColumn}>
                    {wprops.actions}
                </View>
            }

            {wprops.note &&
                <View style={{ paddingLeft: 25 }}>
                    <Text style={styles.textSmall}>{wprops.note}</Text>
                </View>
            }
        </View>

    );
}