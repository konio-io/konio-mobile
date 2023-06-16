import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

/** WalletStack */
export type WalletStackParamList = {
    Wallet: undefined,
    AddCoin: undefined,
    Coin: {
        contractId: string
    },
    Deposit: undefined,
    Withdraw: {
        contractId?: string,
        to?: string
    },
    SwitchWallet: undefined,
    SelectWallet: {
        selected?: string
    },
    SelectCoin: {
        selected?: string
    },
}
export type WalletNavigationProp = StackNavigationProp<WalletStackParamList, 'Wallet'>;
export type WalletRouteProp = RouteProp<WalletStackParamList, 'Wallet'>;
export type AddCoinNavigationProp = StackNavigationProp<WalletStackParamList, 'AddCoin'>;
export type AddCoinRouteProp = RouteProp<WalletStackParamList, 'AddCoin'>;
export type CoinNavigationProp = StackNavigationProp<WalletStackParamList, 'Coin'>;
export type CoinRouteProp = RouteProp<WalletStackParamList, 'Coin'>;
export type DepositNavigationProp = StackNavigationProp<WalletStackParamList, 'Deposit'>;
export type DepositRouteProp = RouteProp<WalletStackParamList, 'Deposit'>;
export type WithdrawNavigationProp = StackNavigationProp<WalletStackParamList, 'Withdraw'>;
export type WithdrawRouteProp = RouteProp<WalletStackParamList, 'Withdraw'>;
export type SwitchWalletNavigationProp = StackNavigationProp<WalletStackParamList, 'SwitchWallet'>;
export type SwitchWalletRouteProp = RouteProp<WalletStackParamList, 'SwitchWallet'>;
export type SelectWalletNavigationProp = StackNavigationProp<WalletStackParamList, 'SelectWallet'>;
export type SelectWalletRouteProp = RouteProp<WalletStackParamList, 'SelectWallet'>;
export type SelectCoinNavigationProp = StackNavigationProp<WalletStackParamList, 'SelectCoin'>;
export type SelectCoinRouteProp = RouteProp<WalletStackParamList, 'SelectCoin'>;

/** SettingStack */
export type SettingStackParamList = {
    Setting: undefined,
    NewWalletAccount: undefined,
    Network: undefined,
    About: undefined
};
export type SettingNavigationProp = StackNavigationProp<SettingStackParamList, 'Setting'>;
export type SettingRouteProp = RouteProp<SettingStackParamList, 'Setting'>;
export type NewWalletAccountProps = StackNavigationProp<SettingStackParamList, 'NewWalletAccount'>;
export type NewWalletAccountRouteProp = RouteProp<SettingStackParamList, 'NewWalletAccount'>;
export type NetworkNavigationProp = StackNavigationProp<SettingStackParamList, 'Network'>;
export type NetworkRouteProp = RouteProp<SettingStackParamList, 'Network'>;
export type AboutNavigationProp = StackNavigationProp<SettingStackParamList, 'About'>;
export type AboutRouteProp = RouteProp<SettingStackParamList, 'About'>;

/** IntroStack */
export type IntroStackParamList = {
    Intro: undefined,
    SetPassword: undefined,
    NewWallet: undefined,
    NewWalletSeed: undefined,
    NewWalletSeedConfirm: {
        seed: string,
        name: string
    },
    ImportWalletSeed: undefined
}
export type IntroNavigationProp = StackNavigationProp<IntroStackParamList, 'Intro'>;
export type IntroRouteProp = RouteProp<IntroStackParamList, 'Intro'>;
export type NewWalletSeedNavigationProp = StackNavigationProp<IntroStackParamList, 'NewWalletSeed'>;
export type NewWalletSeedRouteProp = RouteProp<IntroStackParamList, 'NewWalletSeed'>;
export type NewWalletSeedConfirmNavigationProp = StackNavigationProp<IntroStackParamList, 'NewWalletSeedConfirm'>;
export type NewWalletSeedConfirmRouteProp = RouteProp<IntroStackParamList, 'NewWalletSeedConfirm'>;
export type ImportWalletSeedNavigationProp = StackNavigationProp<IntroStackParamList, 'ImportWalletSeed'>;
export type ImportWalletSeedRouteProp = RouteProp<IntroStackParamList, 'ImportWalletSeed'>;