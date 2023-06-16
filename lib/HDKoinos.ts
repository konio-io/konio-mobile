const KOINOS_PATH = "m/44'/659'/";

import { Signer } from "koilib";
import { ethers } from "ethers";
import crypto from 'react-native-quick-crypto';
export class HDKoinos {
  static randomMnemonic() {
    return ethers.utils.entropyToMnemonic(
      crypto.getRandomValues(new Uint8Array(16))
    );
  }

  static async createWallet(mnemonic: string, index: number) {
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const keyPath = `${KOINOS_PATH}${index}'/0/0`;
    const key = hdNode.derivePath(keyPath);
    const signer = new Signer({
      privateKey: key.privateKey.slice(2),
    });

    return {
      address: signer.getAddress(),
      privateKey: signer.getPrivateKey("wif", false)
    };
  }
  
}

export default HDKoinos;