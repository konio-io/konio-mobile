import { Signer, utils } from "koilib";
import { TransactionJsonWait } from "koilib/lib/interface";
import { ManaStore, UserStore, EncryptedStore, LockStore, WCStore, KapStore, SpinnerStore } from "../stores";
import { Contact, Coin, Network, Transaction, Account, NFT, NFTCollection } from "../types/store";
import { TRANSACTION_STATUS_ERROR, TRANSACTION_STATUS_PENDING, TRANSACTION_STATUS_SUCCESS, WC_METHODS } from "../lib/Constants";
import HDKoinos from "../lib/HDKoinos";
import Toast from 'react-native-toast-message';
import { none } from "@hookstate/core";
import { getContract, getProvider, getSigner, signMessage, prepareTransaction, sendTransaction, signAndSendTransaction, signHash, signTransaction, waitForTransaction, getKapProfileByAddress, getKapAddressByName, isMainnet, getSeedAddress, convertIpfsToHttps, getContractInfo, getCoinPrice, getCoinBalance, getCoinContract, getNftContract, getNft } from "../lib/utils";
import migrations from "../stores/migrations";
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils';
import { initWCWallet } from "../lib/WalletConnect";
import { Assets } from "../types/store";
import * as StoreReview from 'expo-store-review';

export const showToast = (args: {
    type: string,
    text1: string,
    text2?: string
}) => {
    Toast.show(args);
}

export const generateSeed = () => {
    return HDKoinos.randomMnemonic();
}



