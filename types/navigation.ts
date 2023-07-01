import type { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

/** RootStack */
export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<TabParamList>
    Unlock: {
        key: string
    },
    ResetPassword: undefined
}
export type MainTabsNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;
export type MainTabsRouteProp = RouteProp<RootStackParamList, 'MainTabs'>;
export type UnlockNavigationProp = StackNavigationProp<RootStackParamList, 'Unlock'>;
export type UnlockRouteProp = RouteProp<RootStackParamList, 'Unlock'>;
export type ResetPasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ResetPassword'>;
export type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

/** MainTabs */
export type TabParamList = {
    AccountStack: NavigatorScreenParams<AccountStackParamList>,
    OperationsStack: NavigatorScreenParams<OperationsStackParamList>,
    Dapps: undefined,
    SettingStack: NavigatorScreenParams<SettingStackParamList>
}
export type AccountStackNavigationProp = StackNavigationProp<TabParamList, 'AccountStack'>;
export type AccountStackRouteProp = RouteProp<TabParamList, 'AccountStack'>;
export type OperationsStackNavigationProp = StackNavigationProp<TabParamList, 'OperationsStack'>;
export type OperationsStackRouteProp = RouteProp<TabParamList, 'OperationsStack'>;
export type DappsNavigationProp = StackNavigationProp<TabParamList, 'Dapps'>;
export type DappsRouteProp = RouteProp<TabParamList, 'Dapps'>;
export type SettingStackNavigationProp = StackNavigationProp<TabParamList, 'SettingStack'>;
export type SettingStackRouteProp = RouteProp<TabParamList, 'SettingStack'>;

/** AccountStack */
export type AccountStackParamList = {
    Account: undefined,
    NewCoin: undefined,
    Coin: {
        contractId: string
    },
    SwitchAccount: undefined,
    NewAccount: undefined,
    EditAccount: {
        address: string
    }
}
export type AccountNavigationProp = StackNavigationProp<AccountStackParamList, 'Account'>;
export type AccountRouteProp = RouteProp<AccountStackParamList, 'Account'>;
export type NewCoinNavigationProp = StackNavigationProp<AccountStackParamList, 'NewCoin'>;
export type NewCoinRouteProp = RouteProp<AccountStackParamList, 'NewCoin'>;
export type CoinNavigationProp = StackNavigationProp<AccountStackParamList, 'Coin'>;
export type CoinRouteProp = RouteProp<AccountStackParamList, 'Coin'>;
export type SwitchAccountNavigationProp = StackNavigationProp<AccountStackParamList, 'SwitchAccount'>;
export type SwitchAccountRouteProp = RouteProp<AccountStackParamList, 'SwitchAccount'>;
export type NewAccountNavigationProps = StackNavigationProp<AccountStackParamList, 'NewAccount'>;
export type NewAccountRouteProp = RouteProp<AccountStackParamList, 'NewAccount'>;
export type EditAccountNavigationProps = StackNavigationProp<AccountStackParamList, 'EditAccount'>;
export type EditAccountRouteProp = RouteProp<AccountStackParamList, 'EditAccount'>;

/** OperationsStack */
export type OperationsStackParamList = {
    WithdrawStack: NavigatorScreenParams<WithdrawStackParamList>,
    Deposit: undefined,
    Swap: undefined
}
export type WithdrawStackNavigationProp = StackNavigationProp<OperationsStackParamList, 'WithdrawStack'>;
export type WithdrawStackRouteProp = RouteProp<OperationsStackParamList, 'WithdrawStack'>;
export type DepositNavigationProp = StackNavigationProp<OperationsStackParamList, 'Deposit'>;
export type DepositRouteProp = RouteProp<OperationsStackParamList, 'Deposit'>;
export type SwapNavigationProp = StackNavigationProp<OperationsStackParamList, 'Swap'>;
export type SwapRouteProp = RouteProp<OperationsStackParamList, 'Swap'>;


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
    WithdrawTo: {
        to?: string,
        contractId?: string
    }
    WithdrawAmount: {
        to: string,
        contractId?: string
    },
    WithdrawConfirm: {
        to: string,
        contractId: string,
        amount: string
    },
    WithdrawSelectCoin: {
        to: string,
        selected?: string
    },
    WithdrawSelectTo: {
        selected?: string,
        contractId?: string,
    },
    WithdrawAddressbook: {
        selected?: string,
        contractId?: string,
    },
    NewAddressbookItem: undefined
}
export type WithdrawToNavigationProp = StackNavigationProp<WithdrawStackParamList, 'WithdrawTo'>;
export type WithdrawToRouteProp = RouteProp<WithdrawStackParamList, 'WithdrawTo'>;
export type WithdrawAmountNavigationProp = StackNavigationProp<WithdrawStackParamList, 'WithdrawAmount'>;
export type WithdrawAmountRouteProp = RouteProp<WithdrawStackParamList, 'WithdrawAmount'>;
export type WithdrawConfirmNavigationProp = StackNavigationProp<WithdrawStackParamList, 'WithdrawConfirm'>;
export type WithdrawConfirmRouteProp = RouteProp<WithdrawStackParamList, 'WithdrawConfirm'>;
export type WithdrawSelectCoinNavigationProp = StackNavigationProp<WithdrawStackParamList, 'WithdrawSelectCoin'>;
export type WithdrawSelectCoinRouteProp = RouteProp<WithdrawStackParamList, 'WithdrawSelectCoin'>;
export type WithdrawSelectToNavigationProp = StackNavigationProp<WithdrawStackParamList, 'WithdrawSelectTo'>;
export type WithdrawSelectToRouteProp = RouteProp<WithdrawStackParamList, 'WithdrawSelectTo'>;
export type WithdrawAddressbookNavigationProp = StackNavigationProp<WithdrawStackParamList, 'WithdrawAddressbook'>;
export type WithdrawAddressbookRouteProp = RouteProp<WithdrawStackParamList, 'WithdrawAddressbook'>;
export type NewAddressbookItemNavigationProp = StackNavigationProp<WithdrawStackParamList, 'NewAddressbookItem'>;
export type NewAddressbookItemRouteProp = RouteProp<WithdrawStackParamList, 'NewAddressbookItem'>;