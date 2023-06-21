import { View } from 'react-native';
import { Wrapper, TextInput, Button } from '../components';
import { useTheme, useWithdraw, useI18n } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import { SelectRecipientNavigationProp } from '../types/navigation';
import { setWithdrawAddress, showToast } from '../actions';
import { Feather, AntDesign } from '@expo/vector-icons';

export default () => {
    const navigation = useNavigation<SelectRecipientNavigationProp>();
    const withdraw = useWithdraw();
    const theme = useTheme();
    const { Spacing } = theme.vars;
    const i18n = useI18n();

    const next = () => {
        const withdrawAddressOrNull = withdraw.address.ornull;
        if (!withdrawAddressOrNull?.get()) {
            showToast({
                type: 'error',
                text1: i18n.t('missing_destination')
            });
            return;
        }

        setWithdrawAddress(withdrawAddressOrNull.get());
        navigation.push('SelectAmount');
    };

    return (
        <Wrapper>
            <View style={{rowGap: Spacing.small}}>
                <TextInput
                    placeholder={i18n.t('destination_address')}
                    value={withdraw.address.get()}
                    onChangeText={(v: string) => { withdraw.address.set(v) }}
                />

                <View style={{ flexDirection: 'row', columnGap: Spacing.small }}>
                    <Button
                        style={{ flex: 1 }}
                        onPress={() => navigation.push('SelectAccount')}
                        icon={<AntDesign name="wallet" />}
                        type='secondary'
                    />
                    <Button
                        style={{ flex: 1 }}
                        onPress={() => showToast({ type: 'info', text1: i18n.t('available_soon') })}
                        icon={<Feather name="book-open" />}
                        type='secondary'
                    />
                    <Button
                        style={{ flex: 1 }}
                        onPress={() => showToast({ type: 'info', text1: i18n.t('available_soon') })}
                        icon={<AntDesign name="qrcode" />}
                        type='secondary'
                    />
                </View>
            </View>


            <Button
                title={i18n.t('next')}
                onPress={next}
                icon={<Feather name="arrow-right" />}
            />
        </Wrapper>
    )
}