import { View, Share } from 'react-native';
import { Text, Button, Address, Wrapper } from '../components';
import { useCurrentAddress, useTheme, useI18n } from '../hooks';
import { AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Loading from './Loading';
import { State } from '@hookstate/core';

export default () => {
    const i18n = useI18n();
    const currentAddress = useCurrentAddress();
    const currentAddressOrNull : State<string> | null = currentAddress.ornull;
    if (!currentAddressOrNull) {
        return <Loading/>
    }
    
    const address = currentAddressOrNull.get();

    const shareAddress = async () => {
        await Share.share({
            message: address
        });
    };

    const theme = useTheme();
    const { Spacing, Border } = theme.vars;

    return (
        <Wrapper>

            <View style={{ alignItems: 'center', rowGap: Spacing.base }}>
                <Text>{i18n.t('scan_qrcode')}</Text>

                <View style={{borderWidth: Border.width, borderColor: Border.color, borderRadius: Border.radius, padding: Spacing.small}}>
                    <QRCode
                        size={200}
                        value={address}
                        logoBackgroundColor='transparent'
                    />
                </View>
                
                <Address address={address} />
            </View>

            <Button
                title="Share"
                onPress={shareAddress}
                icon={<AntDesign name="sharealt"/>}
            />

        </Wrapper>
    );
}