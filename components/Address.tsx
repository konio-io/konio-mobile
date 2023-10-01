import * as Clipboard from 'expo-clipboard';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, useI18n } from '../hooks';
import Toast from 'react-native-toast-message';
import { compactString } from '../lib/utils';

export default (props: {
    address: string,
    length?: number,
    copiable?: boolean
}) => {
    const i18n = useI18n();
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(props.address);
        Toast.show({
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

    return (
        <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
                {compactString(props.address, length)}
            </Text>

            {props.copiable === true &&
                <Feather name="copy" size={12} color={Color.secondary} />
            }
        </View>
    );
}