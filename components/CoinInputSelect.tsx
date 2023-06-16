import { View, Pressable } from 'react-native';
import { State, useHookstate } from '@hookstate/core';
import { useEffect } from 'react';
import { UserStore } from '../stores';
import TextInput from './TextInput';
import { useNavigation } from '@react-navigation/native';
import { WithdrawNavigationProp } from '../types/navigation';
import ButtonPrimaryEmpty from './ButtonPrimaryEmpty';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '../hooks';

export default (props: {
    value: string
}) => {
    const contractId = useHookstate('');
    const coinSymbol = useHookstate('');
    const navigation = useNavigation<WithdrawNavigationProp>();
    const theme = useTheme().get();
    const { Color } = theme.vars;
    
    useEffect(() => {
        contractId.set(props.value);
        if (props.value) {
            const coin = UserStore.coins[contractId.get()];
            coinSymbol.set(coin.symbol.get());
        }
    }, [props.value])

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexGrow: 1, flex: 1, height: 45 }}>
                    <TextInput
                        value={coinSymbol.get()}
                        placeholder='Coin'
                        editable={false}
                    />
                </View>
                <View style={{ width: 45 }}>
                    <ButtonPrimaryEmpty
                        containerStyle={{ height: 45 }}
                        onPress={() => navigation.push('SelectCoin', { selected: contractId.get() })}
                        icon={<AntDesign name="select1" size={18} color={Color.primary} />}
                    />
                </View>
            </View>
        </View>
    );
}