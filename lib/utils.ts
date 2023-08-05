import { Contract, utils, Provider, Signer } from "koilib";
import { UserStore, EncryptedStore } from "../stores";
import { Abi, SendTransactionOptions, TransactionJson, TransactionJsonWait, TransactionReceipt } from "koilib/lib/interface";
import { DEFAULT_NETWORKS, KAP_NAMESERVICE_CID, KAP_PROFILE_CID } from "./Constants";

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

export const getCoinBalance = async (args: {
    address: string,
    networkId: string,
    contractId: string,
    decimal: number
}) => {
    const { address, networkId, contractId, decimal } = args;
    const contract = await getContract({
        address,
        networkId,
        contractId
    });
    const response = await contract.functions.balance_of({ owner: address });
    if (response.result) {
        return utils.formatUnits(response.result.value, decimal);
    }

    return '0';
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
    return utils.encodeBase64(signedHash);
}

export const signMessage = async (
    signer: Signer,
    message: string
): Promise<string> => {
    const signedMessage = await signer.signMessage(message);
    return utils.encodeBase64(signedMessage);
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
    return currentNetwork.name === "Koinos Mainnet";
}