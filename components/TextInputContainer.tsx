import { View } from 'react-native';
import { useTheme } from '../hooks';
import { rgba } from '../lib/utils';
import { Feather } from '@expo/vector-icons';
import React, { ReactElement } from 'react';
import Text from './Text';
import ActivityIndicator from './ActivityIndicator';

export default (props: {
    style?: Object,
    children: ReactElement,
    loading?: boolean,
    actionX?: ReactElement 
    actions?: ReactElement
    note?: string
}) => {

    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    return (

        <View style={{ ...styles.textInputContainer, ...props.style }}>
            <View style={{ ...styles.directionRow, ...styles.columnGapSmall }}>
                <View style={{ marginTop: 2 }}>
                    <Feather size={18} name="chevron-right" color={rgba(Color.baseContrast, 0.5)} />
                </View>

                {props.children}

                {props.loading &&
                    <ActivityIndicator/>
                }

                {props.actionX}

            </View>
            {props.actions &&
                <View style={styles.alignEndColumn}>
                    {props.actions}
                </View>
            }

            {props.note &&
                <View style={{ paddingLeft: 25 }}>
                    <Text style={styles.textSmall}>{props.note}</Text>
                </View>
            }
        </View>

    );
}