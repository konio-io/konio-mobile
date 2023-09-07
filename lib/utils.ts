import { Contract, utils, Provider, Signer } from "koilib";
import { UserStore, EncryptedStore, KapStore } from "../stores";
import { Abi, SendTransactionOptions, TransactionJson, TransactionJsonWait, TransactionReceipt } from "koilib/lib/interface";
import { DEFAULT_NETWORKS, KAP_NAMESERVICE_CID, KAP_PROFILE_CID, MAINNET, TOKENS_URL } from "./Constants";

export const rgba = (color: string, opacity: number): string => {
    return color.replace('1)', opacity.toString() + ')');
}

export const getContract = async (args: {
    address: string,
    networkId: string,
    contractId: string
}): Promise<Contract> => {
    const { address, networkId, contractId } = args;
    const signer = getSigner({ address, networkId });
    const provider = signer.provider;
    const contract = new Contract({
        id: contractId,
        provider,
        signer
    });

    await contract.fetchAbi();
    if (!contract.abi) {
        throw new Error("unable to fetch contract abi");
    }

    //Hack
    Object.keys(contract.abi.methods).forEach(m => {
        if (contract.abi) {
            if (contract.abi.methods[m].entry_point === undefined) {
                contract.abi.methods[m].entry_point = Number(contract.abi.methods[m]["entry-point"]);
            }
            if (contract.abi.methods[m].read_only === undefined) {
                contract.abi.methods[m].read_only = contract.abi.methods[m]["read-only"];
            }
        }
    });

    return contract;
}

export const getProvider = (networkId: string): Provider => {
    const network = UserStore.networks[networkId];
    return new Provider([...network.rpcNodes.get()]);
}

export const getSigner = (args: {
    address: string,
    networkId: string
}): Signer => {
    const { address, networkId } = args;
    const account = EncryptedStore.accounts[address];
    const provider = getProvider(networkId);
    const signer = Signer.fromWif(account.privateKey.get());
    signer.provider = provider;
    return signer;
}

export const getKapAddressByName = async (name: string) => {
    const currentAddress = UserStore.currentAddress.get();
    if (!currentAddress) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const contractId = KAP_NAMESERVICE_CID;

    const contract = await getContract({
        address: currentAddress,
        networkId,
        contractId
    });

    const buffer = new TextEncoder().encode(name);
    const token_id = "0x" + utils.toHexString(buffer);

    const response = await contract.functions.owner_of<{ value: string; }>({ token_id });
    return response.result?.value;
}

export const getKapProfileByAddress = async (address: string) => {
    const currentAddress = UserStore.currentAddress.get();
    if (!currentAddress) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const contractId = KAP_PROFILE_CID;

    const contract = await getContract({
        address: currentAddress,
        networkId,
        contractId
    });

    const response = await contract.functions.get_profile({
        address
    });

    return response.result;
}

export const signHash = async (
    signer: Signer,
    hash: string
): Promise<string> => {
    const signedHash = await signer.signHash(utils.decodeBase64(hash));
    return btoa(signedHash.toString());
}

export const signMessage = async (
    signer: Signer,
    message: string
): Promise<string> => {
    const signedMessage = await signer.signMessage(message);
    return btoa(signedMessage.toString());
}

export const prepareTransaction = async (
    signer: Signer,
    tx: TransactionJson
): Promise<TransactionJson> => {
    const transaction = Object.assign({}, tx);
    return await signer.prepareTransaction(transaction);
}

export const signTransaction = async (
    signer: Signer,
    tx: TransactionJson,
    abis?: Record<string, Abi>
): Promise<TransactionJson> => {
    const transaction = Object.assign({}, tx);
    return await signer.signTransaction(transaction, abis);
}

export const sendTransaction = async (
    signer: Signer,
    tx: TransactionJson,
    options?: SendTransactionOptions
): Promise<{
    receipt: TransactionReceipt
    transaction: TransactionJsonWait
}> => {
    const transaction = Object.assign({}, tx);
    return await signer.sendTransaction(transaction, options);
}

export const signAndSendTransaction = async (
    signer: Signer,
    tx: TransactionJson,
    options?: SendTransactionOptions
): Promise<{
    receipt: TransactionReceipt
    transaction: TransactionJsonWait
}> => {
    const transaction = await signTransaction(signer, tx, options?.abis);
    return await sendTransaction(signer, transaction, options);
}

export const waitForTransaction = async (
    transactionId: string,
    type?: 'byTransactionId' | 'byBlock',
    timeout?: number
): Promise<{
    blockId: string,
    blockNumber?: number
}> => {
    const provider = getProvider(UserStore.currentNetworkId.get());
    return await provider.wait(transactionId, type, timeout);
}

export const isASCIIString = (str: string) => {
    const nonASCIIRegex = /[^\x00-\x7F]/;
    return !nonASCIIRegex.test(str);
}

export const isMainnet = () => {
    const currentNetworkId = UserStore.currentNetworkId.get();
    const currentNetwork = DEFAULT_NETWORKS[currentNetworkId];
    return currentNetwork.chainId === MAINNET;
}

export const getSeedAddress = () => {
    const seedAccount = Object.values(EncryptedStore.accounts.get()).filter(account => account.seed)[0];
    if (!seedAccount) {
        return null;
    }

    return seedAccount.address;
}

export const getContact = (search: string) => {
    const accounts = UserStore.accounts;
    const addressbook = UserStore.addressbook;
    const kap = KapStore;

    const accountByAddress = accounts[search].get();
    if (accountByAddress) {
        return {
            name: accountByAddress.name,
            address: search,
            addable: false
        };
    }

    const accountByName = Object.keys(accounts.get()).filter(address => accounts[address].name.get() === search);
    if (accountByName.length > 0) {
        return {
            name: search,
            address: accountByName[0],
            addable: false
        };
    }

    const contactByAddress = addressbook[search].get();
    if (contactByAddress) {
        return {
            name: contactByAddress.name,
            address: search,
            addable: false
        };
    }

    const contactByName = Object.keys(addressbook.get()).filter(address => addressbook[address].name.get() === search);
    if (contactByName.length > 0) {
        return {
            name: search,
            address: contactByName[0],
            addable: false
        };
    }

    if (isMainnet()) {
        const kapByAddress = kap[search].get();
        if (kapByAddress) {
            return {
                name: kapByAddress,
                address: search,
                addable: true
            }
        }

        const kapByName = Object.keys(kap.get()).filter(address => kap[address].get() === search);
        if (kapByName.length > 0) {
            return {
                name: search,
                address: kapByName[0],
                addable: true
            };
        }
    }

    try {
        const check = utils.isChecksumAddress(search);
        if (check) {
            return {
                name: '',
                address: search,
                addable: true
            }
        }
    } catch (e) {
        return null;
    }

    return null;
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

export const getContractInfo = async (contractId: string) => {
    return fetch(`${TOKENS_URL}/${contractId}.json`)
        .then(response => response.json());
}

export const getCoinPrice = async (contractId: string) => {
    const response = await getContractInfo(contractId)
    if (response.priceUrl && response.pricePath) {
        const priceResponse = await fetch(response.priceUrl);
        const price = await priceResponse.json();

        if (price) {
            return accessPropertyValue(price, response.pricePath);
        }
    }

    return null;
}

export const getCoinBalance = async (args: {
    address: string,
    networkId: string,
    contractId: string
}) => {
    const { contractId, address, networkId } = args;

    const contract = await getContract({
        contractId,
        address,
        networkId
    });

    const balanceResponse = await contract.functions.balance_of({ owner: address });

    if (balanceResponse && balanceResponse.result?.value !== undefined) {
        return parseFloat(balanceResponse.result?.value);
    }

    return null;
}

export const getCoinContract = async (args: {
    address: string,
    networkId: string,
    contractId: string
}) => {
    const { contractId, address, networkId } = args;
    const contract = await getContract({
        contractId,
        address,
        networkId
    });

    const result = { ...contract, symbol: '', decimal: undefined };
  
    const symbolResponse = await contract.functions.symbol();
    if (symbolResponse.result?.value) {
        result.symbol = symbolResponse.result.value;
    }

    const decimalResponse = await contract.functions.decimals();
    if (decimalResponse.result?.value) {
        result.decimal = decimalResponse.result.value;
    }

    return result;
}