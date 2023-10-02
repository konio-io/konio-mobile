import { View, Share, StyleSheet } from 'react-native';
import { Text, Button, Address, Wrapper, Screen, DrawerToggler } from '../components';
import { useTheme, useI18n, useCurrentAccount } from '../hooks';
import { AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import type { Theme } from '../types/ui';
import { useNavigation } from '@react-navigation/native';
import { DepositNavigationProp } from '../types/navigation';
import { useEffect } from 'react';

export default () => {
    const i18n = useI18n();
    const navigation = useNavigation<DepositNavigationProp>();
    const account = useCurrentAccount();

    const shareAddress = async () => {
        await Share.share({
            message: account.address
        });
    };

    const theme = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerLeft: () => (<DrawerToggler/>)
        });
    }, [navigation]);

    return (
        <Screen>
            <Wrapper>
                <View style={styles.container}>
                    <Text>{i18n.t('scan_qrcode')}</Text>

                    <View style={styles.qrcodeContainer}>
                        <QRCode
                            size={200}
                            value={account.address}
                            logoBackgroundColor='transparent'
                        />
                    </View>

                    <Address address={account.address} copiable={true} />
                </View>
            </Wrapper>

            <View style={styles.paddingBase}>
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
            backgroundColor: 'white',
            borderWidth: Border.width,
            borderColor: Border.color,
            borderRadius: Border.radius,
            padding: Spacing.small
        },
    });
}
