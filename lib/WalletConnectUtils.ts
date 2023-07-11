import "@walletconnect/react-native-compat";
import "@ethersproject/shims";

import { Core } from "@walletconnect/core";
import { ICore } from "@walletconnect/types";
import { Web3Wallet, IWeb3Wallet } from "@walletconnect/web3wallet";

export let web3wallet: IWeb3Wallet;
export let core: ICore;

import { useState, useCallback, useEffect } from "react";

async function createWeb3Wallet() {
  const ENV_PROJECT_ID = "c0d8292ab97b4f7adb8f12f095d2806a";
  const core = new Core({
    projectId: ENV_PROJECT_ID,
  });

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "Web3Wallet React Native Tutorial",
      description: "ReactNative Web3Wallet",
      url: "https://walletconnect.com/",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  });
}

// Initialize the Web3Wallet
export default function useInitialization(onSessionProposal: any, onSessionRequest: any) {
  const [initialized, setInitialized] = useState(false);

  const onInitialize = useCallback(async () => {
    console.log('initialize w3w')
    try {
      await createWeb3Wallet();
      setInitialized(true);
      web3wallet?.on("session_proposal", onSessionProposal);
      web3wallet?.on("session_request", onSessionRequest);

    } catch (err: unknown) {
      console.log("Error for initializing", err);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
}

export async function web3WalletPair(params: { uri: string }) {
  return await web3wallet.core.pairing.pair({ uri: params.uri });
}