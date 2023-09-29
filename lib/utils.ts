const KOINOS_PATH = "m/44'/659'/";

import { Signer } from "koilib";
import { ethers } from "ethers";
import crypto from 'react-native-quick-crypto';

export const rgba = (color: string, opacity: number): string => {
    return color.replace('1)', opacity.toString() + ')');
}

export const isASCIIString = (str: string) => {
    const nonASCIIRegex = /[^\x00-\x7F]/;
    return !nonASCIIRegex.test(str);
}

export const convertIpfsToHttps = (ipfsLink: string) => {
    if (ipfsLink.startsWith("ipfs://")) {
        const ipfsHash = ipfsLink.slice(7);
        const httpsLink = `https://ipfs.io/ipfs/${ipfsHash}`;
        return httpsLink;
    } else {
        return ipfsLink;
    }
}

export const accessPropertyValue = (obj: Record<string, any>, path: string): any => {
    const keys = path.split('.');
    let currentObj: Record<string, any> | null = obj;

    for (const key of keys) {
        if (currentObj && currentObj.hasOwnProperty(key)) {
            currentObj = currentObj[key];
        } else {
            return null;
        }
    }

    return currentObj;
}

export const generateSeed = () => {
    return randomMnemonic();
}

export const randomMnemonic = () => {
    return ethers.utils.entropyToMnemonic(
        crypto.getRandomValues(new Uint8Array(16))
    );
}

export const createWallet = (mnemonic: string, index: number) => {
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

export const compactString = (word: string, length: number) : string => {
    return `${word.substring(0, length)} ... ${word.substring(word.length - length, word.length)}`;
}