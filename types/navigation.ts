import type { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

/** WalletStack */
export type WalletStackParamList = {
    Wallet: undefined,
    AddCoin: undefined,
    Coin: {
        contractId: string
    },
    Deposit: undefined,
    Withdraw: NavigatorScreenParams<WithdrawStackParamList>,
    SwitchAccount: undefined,
    NewWalletAccount: undefined,
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
export type SwitchAccountNavigationProp = StackNavigationProp<WalletStackParamList, 'SwitchAccount'>;
export type SwitchAccountRouteProp = RouteProp<WalletStackParamList, 'SwitchAccount'>;
export type NewWalletAccountProps = StackNavigationProp<WalletStackParamList, 'NewWalletAccount'>;
export type NewWalletAccountRouteProp = RouteProp<WalletStackParamList, 'NewWalletAccount'>;

/** SettingStack */
export type SettingStackParamList = {
    Setting: undefined,
    ChangeNetwork: undefined,
    About: undefined,
    ShowSeed: undefined,
    ChangeTheme: undefined,
    ChangeLocale: undefined,
    ChangePassword: undefined,
    ChangeAutolock: undefined,
    Security: undefined
};
export type SettingNavigationProp = StackNavigationProp<SettingStackParamList, 'Setting'>;
export type SettingRouteProp = RouteProp<SettingStackParamList, 'Setting'>;
export type ChangeNetworkNavigationProp = StackNavigationProp<SettingStackParamList, 'ChangeNetwork'>;
export type ChangeNetworkRouteProp = RouteProp<SettingStackParamList, 'ChangeNetwork'>;
export type AboutNavigationProp = StackNavigationProp<SettingStackParamList, 'About'>;
export type AboutRouteProp = RouteProp<SettingStackParamList, 'About'>;
export type ShowSeedNavigationProp = StackNavigationProp<SettingStackParamList, 'ShowSeed'>;
export type ShowSeedRouteProp = RouteProp<SettingStackParamList, 'ShowSeed'>;
export type ChangeThemeNavigationProp = StackNavigationProp<SettingStackParamList, 'ChangeTheme'>;
export type ChangeThemeRouteProp = RouteProp<SettingStackParamList, 'ChangeTheme'>;
export type ChangeLocaleNavigationProp = StackNavigationProp<SettingStackParamList, 'ChangeLocale'>;
export type ChangeLocaleRouteProp = RouteProp<SettingStackParamList, 'ChangeLocale'>;
export type SecurityNavigationProp = StackNavigationProp<SettingStackParamList, 'Security'>;
export type SecurityRouteProp = RouteProp<SettingStackParamList, 'Security'>;
export type ChangePasswordNavigationProp = StackNavigationProp<SettingStackParamList, 'ChangePassword'>;
export type ChangePasswordRouteProp = RouteProp<SettingStackParamList, 'ChangePassword'>;
export type ChangeAutolockNavigationProp = StackNavigationProp<SettingStackParamList, 'ChangeAutolock'>;
export type ChangeAutolockRouteProp = RouteProp<SettingStackParamList, 'ChangeAutolock'>;

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

/** WithdrawStack */
export type WithdrawStackParamList = {
    SelectRecipient: undefined
    SelectAmount: undefined
    ConfirmWithdraw: undefined
    SelectCoin: undefined,
    SelectAccount: undefined
}
export type SelectRecipientNavigationProp = StackNavigationProp<WithdrawStackParamList, 'SelectRecipient'>;
export type SelectRecipientRouteProp = RouteProp<WithdrawStackParamList, 'SelectRecipient'>;
export type SelectAmountNavigationProp = StackNavigationProp<WithdrawStackParamList, 'SelectAmount'>;
export type SelectAmountRouteProp = RouteProp<WithdrawStackParamList, 'SelectAmount'>;
export type ConfirmWithdrawNavigationProp = StackNavigationProp<WithdrawStackParamList, 'ConfirmWithdraw'>;
export type ConfirmWithdrawRouteProp = RouteProp<WithdrawStackParamList, 'ConfirmWithdraw'>;
export type SelectCoinNavigationProp = StackNavigationProp<WithdrawStackParamList, 'SelectCoin'>;
export type SelectCoinRouteProp = RouteProp<WithdrawStackParamList, 'SelectCoin'>;
export type SelectAccountNavigationProp = StackNavigationProp<WithdrawStackParamList, 'SelectAccount'>;
export type SelectAccountRouteProp = RouteProp<WithdrawStackParamList, 'SelectAccount'>;

/** RootStack */
export type RootStackParamList = {
    Unlock: {
        key: string
    },
    ResetPassword: undefined
}
export type UnlockNavigationProp = StackNavigationProp<RootStackParamList, 'Unlock'>;
export type UnlockRouteProp = RouteProp<RootStackParamList, 'Unlock'>;
export type ResetPasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>;
export type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;