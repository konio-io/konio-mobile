import { hookstate } from "@hookstate/core";
import { StoreRegistry } from "../types/store";

const stores: StoreRegistry = {} as StoreRegistry;

export const registerStore = <T extends keyof StoreRegistry>(
  storeName: T,
  store: StoreRegistry[T]
) => {
  stores[storeName] = store;
};

export const getStore = <T extends keyof StoreRegistry>(
  storeName: T
): StoreRegistry[T] => {
  return stores[storeName];
};

export const loadedState = hookstate({
  setting: false,
  secure: false,
  account: false,
  coin: false,
  network: false
});

export default stores;