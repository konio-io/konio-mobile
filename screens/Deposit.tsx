import { View, Share } from 'react-native';
import { Text, ButtonPrimary, Address, Wrapper } from '../components';
import { useCurrentAddress, useTheme } from '../hooks';
import { AntDesign } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Loading from './Loading';
import { State } from '@hookstate/core';
import i18n from '../locales';

export default () => {
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

    const theme = useTheme().get();
    const { Color, Spacing, Border } = theme.vars;

    return (
        <Wrapper>

            <View style={{ alignItems: 'center', rowGap: Spacing.base }}>
                <Text>{i18n.t('scan_qr_code')}</Text>

                <View style={{borderWidth: Border.width, borderColor: Border.color, borderRadius: Border.radius, padding: Spacing.small}}>
                    <QRCode
                        size={200}
                        value={address}
                        logoBackgroundColor='transparent'
                    />
                </View>
                
            </View>

            <Address address={address} />

            <ButtonPrimary
                title="Share"
                onPress={shareAddress}
                icon={<AntDesign name="sharealt" size={18} color={Color.primaryContrast} />}
            />

        </Wrapper>
    );
}