import * as Clipboard from 'expo-clipboard';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n, useKapAddress } from '../hooks';
import { refreshKap, showToast } from '../actions';
import { useEffect } from 'react';

export default (props: {
    address: string,
    length?: number,
    copiable?: boolean
}) => {
    const i18n = useI18n();
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(props.address);
        showToast({
            type: 'info',
            text1: i18n.t('address_copied')
        });
    };

    if (props.copiable) {
        return (
            <TouchableOpacity onPress={copyToClipboard}>
                <Container {...props} />
            </TouchableOpacity>
        );
    }

    return <Container {...props} />
}

const Container = (props: {
    address: string,
    length?: number,
    copiable?: boolean
}) => {
    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;
    const length = props.length ?? 5;
    const kapName = useKapAddress(props.address);

    useEffect(() => {
        refreshKap(props.address);
    }, [props.address])

    return (
        <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
                { kapName.ornull && 
                    `${kapName.get()}`
                }

                { !kapName.ornull && 
                    `${props.address.substring(0, length)} ... ${props.address.substring(props.address.length - length, props.address.length)}`
                }
            </Text>

            {props.copiable === true &&
                <Feather name="copy" size={12} color={Color.secondary} />
            }
        </View>
    );
}