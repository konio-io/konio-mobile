import { View } from 'react-native';
import { useHookstate } from '@hookstate/core';
import ButtonPrimaryEmpty from './ButtonPrimaryEmpty';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import TextInput from './TextInput';
import { useNavigation } from '@react-navigation/native';
import { WithdrawNavigationProp } from '../types/navigation';
import { useEffect } from 'react';
import i18n from '../locales';

export default (props: {
    value: string,
    onChangeText: Function
}) => {
    const navigation = useNavigation<WithdrawNavigationProp>();
    const address = useHookstate('');
    const theme = useTheme().get();
    const { Color } = theme.vars;
    const styles = theme.styles;

    useEffect(() => {
        address.set(props.value.trim());
    }, [props.value]);

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexGrow: 1, flex: 1, height: 48 }}>
                    <TextInput
                        style={{ ...styles.textInput, ...styles.textSmall }}
                        multiline={true}
                        value={address.get()}
                        placeholder={i18n.t('destination_address')}
                        onChangeText={(v: string) => {
                            props.onChangeText(v);
                        }}
                    />
                </View>
                <View style={{ width: 45 }}>
                    <ButtonPrimaryEmpty
                        containerStyle={{ height: 45 }}
                        onPress={() => navigation.push('SelectWallet', { selected: address.get() })}
                        icon={<AntDesign name="select1" size={18} color={Color.primary} />}
                    />
                </View>
            </View>
        </View>
    );
}

