import { UserStore, UserStoreDefault } from ".";
import { DEFAULT_NETWORKS, DONATION_ADDRESS } from "../lib/Constants";

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
    },
    '20230705': () => {
        UserStore.addressbook.merge({
            [DONATION_ADDRESS]: {
                name: 'Adrihoke',
                address: DONATION_ADDRESS
            }
        });
        UserStore.rcLimit.set('95');
    },
    '20230708': () => {
        UserStore.addressbook.merge({
            [DONATION_ADDRESS]: {
                name: 'Konio Donations',
                address: DONATION_ADDRESS
            }
        });
    }
}

export default migrations;