import type { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SignClientTypes } from "@walletconnect/types";

/** Drawer */
export type DrawerParamList = {
    Root: NavigatorScreenParams<RootParamList>
}
export type RootNavigationProp = StackNavigationProp<DrawerParamList, 'Root'>;
export type RootRouteProp = RouteProp<DrawerParamList, 'Root'>;

/** Root */
export type RootParamList = {
    Account: NavigatorScreenParams<AccountParamList>
    Settings: NavigatorScreenParams<SettingsParamList>
    Unlock: undefined,
    ResetPassword: undefined,
    NewAccount: undefined,
    ImportAccount: undefined,
    EditAccount: {
        address: string
    },
    WcProposal: {
        proposal: SignClientTypes.EventArguments["session_proposal"]
    },
    WcRequest: {
        request:  SignClientTypes.EventArguments["session_request"]
    },
    WalletConnect: NavigatorScreenParams<WalletConnectParamList>,
    Faq: undefined,
    About: undefined
}
export type AccountNavigationProp = StackNavigationProp<RootParamList, 'Account'>;
export type AccountRouteProp = RouteProp<RootParamList, 'Account'>;
export type UnlockNavigationProp = StackNavigationProp<RootParamList, 'Unlock'>;
export type UnlockRouteProp = RouteProp<RootParamList, 'Unlock'>;
export type ResetPasswordNavigationProp = StackNavigationProp<RootParamList, 'ResetPassword'>;
export type ResetPasswordRouteProp = RouteProp<RootParamList, 'ResetPassword'>;
export type SettingsNavigationProp = StackNavigationProp<RootParamList, 'Settings'>;
export type SettingsRouteProp = RouteProp<RootParamList, 'Settings'>;
export type NewAccountNavigationProps = StackNavigationProp<RootParamList, 'NewAccount'>;
export type NewAccountRouteProp = RouteProp<RootParamList, 'NewAccount'>;
export type ImportAccountNavigationProps = StackNavigationProp<RootParamList, 'ImportAccount'>;
export type ImportAccountRouteProp = RouteProp<RootParamList, 'ImportAccount'>;
export type EditAccountNavigationProps = StackNavigationProp<RootParamList, 'EditAccount'>;
export type EditAccountRouteProp = RouteProp<RootParamList, 'EditAccount'>;
export type WcProposalNavigationProp = StackNavigationProp<RootParamList, 'WcProposal'>;
export type WcProposalRouteProp = RouteProp<RootParamList, 'WcProposal'>;
export type WcRequestNavigationProp = StackNavigationProp<RootParamList, 'WcRequest'>;
export type WcRequestRouteProp = RouteProp<RootParamList, 'WcRequest'>;
export type FaqNavigationProp = StackNavigationProp<RootParamList, 'Faq'>;
export type FaqRouteProp = RouteProp<RootParamList, 'Faq'>;
export type AboutNavigationProp = StackNavigationProp<RootParamList, 'About'>;
export type AboutRouteProp = RouteProp<RootParamList, 'About'>;

/** WalletConnect */
export type WalletConnectParamList = {
    WcPair: {
        uri: string
    },
    WcPairInput: undefined,
    WcPairScan: undefined,
    WcSessions: undefined
}
export type WcPairNavigationProp = StackNavigationProp<WalletConnectParamList, 'WcPair'>;
export type WcPairRouteProp = RouteProp<WalletConnectParamList, 'WcPair'>;
export type WcPairInputNavigationProp = StackNavigationProp<WalletConnectParamList, 'WcPairInput'>;
export type WcPairInputRouteProp = RouteProp<WalletConnectParamList, 'WcPairInput'>;
export type WcPairScanNavigationProp = StackNavigationProp<WalletConnectParamList, 'WcPairScan'>;
export type WcPairScanRouteProp = RouteProp<WalletConnectParamList, 'WcPairScan'>;
export type WcSessionsNavigationProp = StackNavigationProp<WalletConnectParamList, 'WcSessions'>;
export type WcSessionsRouteProp = RouteProp<WalletConnectParamList, 'WcSessions'>;


/** Account */
export type AccountParamList = {
    Holdings: NavigatorScreenParams<HoldingsParamList>,
    Dapps: undefined,
    Withdraw: NavigatorScreenParams<WithdrawParamList>,
    Deposit: undefined,
}
export type HoldingsNavigationProp = StackNavigationProp<AccountParamList, 'Holdings'>;
export type HoldingsRouteProp = RouteProp<AccountParamList, 'Holdings'>;
export type DappsNavigationProp = StackNavigationProp<AccountParamList, 'Dapps'>;
export type DappsRouteProp = RouteProp<AccountParamList, 'Dapps'>;
export type WithdrawNavigationProp = StackNavigationProp<AccountParamList, 'Withdraw'>;
export type WithdrawRouteProp = RouteProp<AccountParamList, 'Withdraw'>;
export type DepositNavigationProp = StackNavigationProp<AccountParamList, 'Deposit'>;
export type DepositRouteProp = RouteProp<AccountParamList, 'Deposit'>;

/** Holdings */
export type HoldingsParamList = {
    Assets: undefined,
    NewCoin: undefined,
    Coin: {
        contractId: string
    },
    NewNft: undefined,
    Nft: {
        tokenId: string,
        contractId: string
    },
}
export type AssetsNavigationProp = StackNavigationProp<HoldingsParamList, 'Assets'>;
export type AssetsRouteProp = RouteProp<HoldingsParamList, 'Assets'>;
export type NewCoinNavigationProp = StackNavigationProp<HoldingsParamList, 'NewCoin'>;
export type NewCoinRouteProp = RouteProp<HoldingsParamList, 'NewCoin'>;
export type CoinNavigationProp = StackNavigationProp<HoldingsParamList, 'Coin'>;
export type CoinRouteProp = RouteProp<HoldingsParamList, 'Coin'>;
export type NewNftNavigationProp = StackNavigationProp<HoldingsParamList, 'NewNft'>;
export type NewNftRouteProp = RouteProp<HoldingsParamList, 'NewNft'>;
export type NftNavigationProp = StackNavigationProp<HoldingsParamList, 'Nft'>;
export type NftRouteProp = RouteProp<HoldingsParamList, 'Nft'>;

/** Settings */
export type SettingsParamList = {
    SettingMenu: undefined,
    ChangeNetwork: undefined,
    ShowSeed: undefined,
    ShowPrivateKeys: undefined,
    ChangeTheme: undefined,
    ChangeLocale: undefined,
    ChangePassword: undefined,
    ChangeAutolock: undefined,
    Security: undefined,
    Advanced: undefined
    NewNetwork: undefined,
    Logs: undefined
};
export type SettingMenuNavigationProp = StackNavigationProp<SettingsParamList, 'SettingMenu'>;
export type SettingMenuRouteProp = RouteProp<SettingsParamList, 'SettingMenu'>;
export type ChangeNetworkNavigationProp = StackNavigationProp<SettingsParamList, 'ChangeNetwork'>;
export type ChangeNetworkRouteProp = RouteProp<SettingsParamList, 'ChangeNetwork'>;
export type ShowSeedNavigationProp = StackNavigationProp<SettingsParamList, 'ShowSeed'>;
export type ShowSeedRouteProp = RouteProp<SettingsParamList, 'ShowSeed'>;
export type ChangeThemeNavigationProp = StackNavigationProp<SettingsParamList, 'ChangeTheme'>;
export type ChangeThemeRouteProp = RouteProp<SettingsParamList, 'ChangeTheme'>;
export type ChangeLocaleNavigationProp = StackNavigationProp<SettingsParamList, 'ChangeLocale'>;
export type ChangeLocaleRouteProp = RouteProp<SettingsParamList, 'ChangeLocale'>;
export type SecurityNavigationProp = StackNavigationProp<SettingsParamList, 'Security'>;
export type SecurityRouteProp = RouteProp<SettingsParamList, 'Security'>;
export type ChangePasswordNavigationProp = StackNavigationProp<SettingsParamList, 'ChangePassword'>;
export type ChangePasswordRouteProp = RouteProp<SettingsParamList, 'ChangePassword'>;
export type ChangeAutolockNavigationProp = StackNavigationProp<SettingsParamList, 'ChangeAutolock'>;
export type ChangeAutolockRouteProp = RouteProp<SettingsParamList, 'ChangeAutolock'>;
export type AdvancedNavigationProp = StackNavigationProp<SettingsParamList, 'Advanced'>;
export type AdvancedRouteProp = RouteProp<SettingsParamList, 'Advanced'>;
export type NewNetworkNavigationProp = StackNavigationProp<SettingsParamList, 'NewNetwork'>;
export type NewNetworkRouteProp = RouteProp<SettingsParamList, 'NewNetwork'>;
export type LogsNavigationProp = StackNavigationProp<SettingsParamList, 'Logs'>;
export type LogsRouteProp = RouteProp<SettingsParamList, 'Logs'>;

/** Intro */
export type IntroParamList = {
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
export type IntroNavigationProp = StackNavigationProp<IntroParamList, 'Intro'>;
export type IntroRouteProp = RouteProp<IntroParamList, 'Intro'>;
export type NewWalletSeedNavigationProp = StackNavigationProp<IntroParamList, 'NewWalletSeed'>;
export type NewWalletSeedRouteProp = RouteProp<IntroParamList, 'NewWalletSeed'>;
export type NewWalletSeedConfirmNavigationProp = StackNavigationProp<IntroParamList, 'NewWalletSeedConfirm'>;
export type NewWalletSeedConfirmRouteProp = RouteProp<IntroParamList, 'NewWalletSeedConfirm'>;
export type ImportWalletSeedNavigationProp = StackNavigationProp<IntroParamList, 'ImportWalletSeed'>;
export type ImportWalletSeedRouteProp = RouteProp<IntroParamList, 'ImportWalletSeed'>;

/** Withdraw */
export type WithdrawParamList = {
    WithdrawTo: {
        to?: string,
        contractId?: string
    },
    WithdrawToScan: undefined,
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
    NewContact: {
        address?: string
    }
}
export type WithdrawToNavigationProp = StackNavigationProp<WithdrawParamList, 'WithdrawTo'>;
export type WithdrawToRouteProp = RouteProp<WithdrawParamList, 'WithdrawTo'>;
export type WithdrawToScanNavigationProp = StackNavigationProp<WithdrawParamList, 'WithdrawToScan'>;
export type WithdrawToScanRouteProp = RouteProp<WithdrawParamList, 'WithdrawToScan'>;
export type WithdrawAmountNavigationProp = StackNavigationProp<WithdrawParamList, 'WithdrawAmount'>;
export type WithdrawAmountRouteProp = RouteProp<WithdrawParamList, 'WithdrawAmount'>;
export type WithdrawConfirmNavigationProp = StackNavigationProp<WithdrawParamList, 'WithdrawConfirm'>;
export type WithdrawConfirmRouteProp = RouteProp<WithdrawParamList, 'WithdrawConfirm'>;
export type WithdrawSelectCoinNavigationProp = StackNavigationProp<WithdrawParamList, 'WithdrawSelectCoin'>;
export type WithdrawSelectCoinRouteProp = RouteProp<WithdrawParamList, 'WithdrawSelectCoin'>;
export type NewContactNavigationProp = StackNavigationProp<WithdrawParamList, 'NewContact'>;
export type NewContactRouteProp = RouteProp<WithdrawParamList, 'NewContact'>;