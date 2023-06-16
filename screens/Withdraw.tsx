import { ButtonPrimary, WalletInputSelect, AmountInput, CoinInputSelect, Wrapper } from '../components';
import { useHookstate } from '@hookstate/core';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import type { WithdrawNavigationProp, WithdrawRouteProp } from '../types/navigation';
import { withdrawCoin, confirmTransaction, showToast } from '../actions'
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import { useEffect } from 'react';

export default () => {
    const route = useRoute<WithdrawRouteProp>();

    const contractId = useHookstate('');
    const navigation = useNavigation<WithdrawNavigationProp>();
    const amount = useHookstate('');
    const to = useHookstate('');

    useEffect(() => {
        if (route.params && route.params.contractId) {
            contractId.set(route.params.contractId);
        }
        if (route.params && route.params.to) {
            to.set(route.params.to);
        }
    },[route.params]);

    const theme = useTheme().get();
    const { Color } = theme.vars;

    const send = () => {

        if (!contractId.get()) {
            showToast({
                type: 'error',
                text1: 'Missing coin'
            });
            return;
        }
        if (!to.get()) {
            showToast({
                type: 'error',
                text1: 'Missing destination address'
            });
            return;
        }
        if (!amount.get()) {
            showToast({
                type: 'error',
                text1: 'Missing amount'
            });
            return;
        }

        withdrawCoin({
            to: to.get(),
            contractId: contractId.get(),
            value: amount.get()
        })
            .then(transaction => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 1,
                        routes: [
                            { name: 'Wallet' },
                            {
                                name: 'Coin',
                                params: { contractId: contractId.get() },
                            },
                        ],
                    })
                );

                showToast({
                    type: 'success',
                    text1: 'Transaction committed',
                });

                confirmTransaction(transaction).then(tsx => {
                    showToast({
                        type: 'success',
                        text1: 'Transaction confirmed',
                    });
                })
                    .catch(e => {
                        console.log(e);
                        showToast({
                            type: 'error',
                            text1: 'Transaction confirm failed'
                        });
                    });
            })
            .catch(e => {
                console.log(e);
                showToast({
                    type: 'error',
                    text1: 'Transaction commit failed'
                });
            });
    };

    return (
        <Wrapper>

            <CoinInputSelect value={contractId.get()} />

            <WalletInputSelect value={to.get()} onChangeText={(v: string) => to.set(v)}/>

            <AmountInput contractId={contractId.get()} onChange={(v: string) => amount.set(v)} />

            <ButtonPrimary
                title="Send"
                onPress={send}
                icon={<Feather name="arrow-up-right" size={18} color={Color.primaryContrast} />}
            />

        </Wrapper>
    );
}