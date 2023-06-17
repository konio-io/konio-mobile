import * as Clipboard from 'expo-clipboard';
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';
import { rgba } from '../lib/utils';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import type { Theme } from '../types/store';
import { showToast } from '../actions';
import i18n from '../locales';

export default (props: {
    address: string,
    compress?: boolean
}) => {
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(props.address);
        showToast({
            type: 'info',
            text1: i18n.t('address_copied')
        });
    };

    const theme = useTheme().get();
    const { Color } = theme.vars;
    const styles = createStyles(theme);

    return (
        <TouchableHighlight onPress={copyToClipboard}>
            <View style={styles.addressButton}>


                {props.compress === true &&
                    <Text style={styles.addressText}>
                        {props.address.substring(0, 10)} ... {props.address.substring(props.address.length - 10, props.address.length)}
                    </Text>
                }
                {props.compress !== true &&
                    <Text style={styles.addressText}>
                        {props.address}
                    </Text>
                }

                <Feather name="copy" size={12} color={rgba(Color.baseContrast, 0.7)} />
            </View>
        </TouchableHighlight>
    );
}

const createStyles = (theme: Theme) => {
    const { Color, Border, Spacing, FontFamily, FontSize } = theme.vars;
    const styles = theme.styles;

    return StyleSheet.create({
        ...theme.styles,
        addressText: {
            ...styles.text,
            ...styles.textCenter,
            flex: 1,
            fontSize:
                FontSize.small,
            paddingHorizontal: Spacing.small
        },
        addressButton: {
            backgroundColor: Color.base,
            borderWidth: Border.width,
            borderColor: rgba(Color.baseContrast, 0.3),
            borderRadius: 5,
            borderStyle: 'dotted',
            fontFamily: FontFamily.sans,
            fontSize: FontSize.small,
            flexDirection: 'row',
            columnGap: Spacing.small,
            justifyContent: 'space-between',
            padding: Spacing.small,
            height: 48,
            alignItems: 'center'
        }
    });
}