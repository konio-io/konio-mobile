import { View, Share, StyleSheet } from 'react-native';
import { Text, Button, Address, Wrapper, Screen } from '../components';
import { useCurrentAddress, useTheme, useI18n } from '../hooks';
import { AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Loading from './Loading';
import { State } from '@hookstate/core';
import type { Theme } from '../types/store';

export default () => {
    const i18n = useI18n();
    const currentAddress = useCurrentAddress();
    const currentAddressOrNull: State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return <Loading />
    }

    const address = currentAddressOrNull.get();

    const shareAddress = async () => {
        await Share.share({
            message: address
        });
    };

    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <Screen>
            <Wrapper>
                <View style={styles.container}>
                    <Text>{i18n.t('scan_qrcode')}</Text>

                    <View style={styles.qrcodeContainer}>
                        <QRCode
                            size={200}
                            value={address}
                            logoBackgroundColor='transparent'
                        />
                    </View>

                    <Address address={address} copiable={true} />
                </View>
            </Wrapper>

            <View style={styles.screenFooter}>
                <Button
                    title="Share"
                    onPress={shareAddress}
                    icon={<AntDesign name="sharealt" />}
                />
            </View>
        </Screen>
    );
}

const createStyles = (theme: Theme) => {
    const { Border, Spacing } = theme.vars;

    return StyleSheet.create({
        ...theme.styles,
        container: {
            alignItems: 'center', 
            rowGap: Spacing.base
        },
        qrcodeContainer: {
            borderWidth: Border.width,
            borderColor: Border.color,
            borderRadius: Border.radius,
            padding: Spacing.small
        },
    });
}
