import * as Clipboard from 'expo-clipboard';
import { TouchableHighlight, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import { showToast } from '../actions';

export default (props: {
    address: string,
    compress?: boolean,
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
            <TouchableHighlight onPress={copyToClipboard}>
                <Container {...props} />
            </TouchableHighlight>
        );
    }

    return <Container {...props} />
}

const Container = (props: {
    address: string,
    compress?: boolean,
    copiable?: boolean
}) => {
    const theme = useTheme();
    const { Color } = theme.vars;
    const styles = theme.styles;

    return (
        <View style={styles.addressContainer}>
            {props.compress === true && props.address.length > 10 &&
                <Text style={styles.addressText}>
                    {props.address.substring(0, 10)} ... {props.address.substring(props.address.length - 10, props.address.length)}
                </Text>
            }
            {props.compress !== true &&
                <Text style={styles.addressText}>
                    {props.address}
                </Text>
            }
            {props.copiable === true &&
                <Feather name="copy" size={12} color={Color.secondary} />
            }
        </View>
    );
}