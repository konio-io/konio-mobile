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

export default stores;