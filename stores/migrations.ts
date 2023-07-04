import { UserStore, UserStoreDefault } from ".";
import { DEFAULT_NETWORKS } from "../lib/Constants";

const migrations : Record<string,Function> = {
    '20230701': () => {},
    '20230704': () => {
        UserStore.rcLimit.set(UserStoreDefault.rcLimit);

        for (const contractId in UserStoreDefault.coins) {
            if (!Object.keys(UserStore.coins).includes(contractId)) {
                UserStore.coins.merge({ [contractId]: UserStoreDefault.coins[contractId] });
            }

            for (const address in UserStore.wallets) {
                const walletCoins = UserStore.wallets[address].coins;
                if (!walletCoins.get().includes(contractId)) {
                    walletCoins.merge([contractId]);
                }
            }
        }

        UserStore.networks.set({ ...DEFAULT_NETWORKS });
        
    }
}

export default migrations;