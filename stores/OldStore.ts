import { hookstate } from '@hookstate/core';
import { localstored } from '@hookstate/localstored';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoSecureStore from 'expo-secure-store';

export const UserStore = hookstate(
    {}, localstored({
        key: 'store',
        engine: AsyncStorage
    })
);

export const EncryptedStore = hookstate(
    {}, localstored({
        key: 'encryptedStore',
        engine: {
            getItem: (key: string) => {
                return ExpoSecureStore.getItemAsync(key);
            },
            setItem: (key: string, value: string) => {
                return ExpoSecureStore.setItemAsync(key, value);
            },
            removeItem: (key: string) => {
                return ExpoSecureStore.deleteItemAsync(key);
            }
        }
    })
);