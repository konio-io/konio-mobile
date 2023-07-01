import { Contract, utils, Provider, Signer } from "koilib";
import { UserStore, EncryptedStore } from "../stores";

export const rgba = (color: string, opacity: number) : string => {
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

export const getKAP = async (name: string) => {
    const address = UserStore.currentAddress.get();
    if (!address) {
        throw new Error('Current address not set');
    }

    const networkId = UserStore.currentNetworkId.get();
    const networks = UserStore.networks;
    const contractId = networks[networkId].kapContractId.get();

    const contract = await getContract({
        address,
        networkId,
        contractId
    });

    const buffer = new TextEncoder().encode(name);
    const token_id = "0x" + utils.toHexString(buffer);

    try {
        const response = await contract.functions.owner_of<{value: string;}>({ token_id });
        return response.result?.value;
    } catch (e) {
        throw e;
    }
}