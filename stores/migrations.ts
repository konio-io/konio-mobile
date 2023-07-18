import { none } from "@hookstate/core";
import { UserStore, UserStoreDefault } from ".";
import { DEFAULT_NETWORK, DEFAULT_NETWORKS, DONATION_ADDRESS } from "../lib/Constants";

const migrations : Record<string,Function> = {
    '20230701': () => {},
    '20230704': () => {
        UserStore.rcLimit.set(UserStoreDefault.rcLimit);

        for (const contractId in UserStoreDefault.coins) {
            if (!Object.keys(UserStore.coins).includes(contractId)) {
                UserStore.coins.merge({ [contractId]: UserStoreDefault.coins[contractId] });
            }

            for (const address in UserStore.accounts) {
                const accountCoins = UserStore.accounts[address].coins;
                if (!accountCoins.get().includes(contractId)) {
                    accountCoins.merge([contractId]);
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
    },
    '20230717': () => {
        const wallets = Object.assign({}, UserStore.wallets.get({noproxy: true}));
        UserStore.merge({accounts: wallets});
        UserStore.wallets.set(none);
    },
    '20230718': () => {
        const oldTestnetChainId = 'EiAAKqFi-puoXnuJTdn7qBGGJa8yd-dcS2P0ciODe4wupQ==';
        if (UserStore.networks[oldTestnetChainId].get()) {
            UserStore.networks[oldTestnetChainId].set(none);
        }

        const newTestnetChainId = 'EiBncD4pKRIQWco_WRqo5Q-xnXR7JuO3PtZv983mKdKHSQ==';
        UserStore.networks.merge({
            [newTestnetChainId]: DEFAULT_NETWORKS[newTestnetChainId]
        });

        UserStore.currentNetworkId.set(DEFAULT_NETWORK);
        UserStore.coins.merge({
            [DEFAULT_NETWORKS[newTestnetChainId].coins.KOIN.contractId]: DEFAULT_NETWORKS[newTestnetChainId].coins.KOIN,
            [DEFAULT_NETWORKS[newTestnetChainId].coins.VHP.contractId]: DEFAULT_NETWORKS[newTestnetChainId].coins.VHP,
        })

        for (const address in UserStore.accounts) {
            UserStore.accounts[address].coins.merge([
                DEFAULT_NETWORKS[newTestnetChainId].coins.KOIN.contractId,
                DEFAULT_NETWORKS[newTestnetChainId].coins.VHP.contractId,
            ])
        }
    },
    '20230719': () => {
        for (const networkId in UserStore.networks) {
            UserStore.networks[networkId].explorer.set('https://koiner.app/transactions');
        }
    }
}

export default migrations;