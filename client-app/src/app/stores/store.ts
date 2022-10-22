import ActivityStore from './activityStore';
import { createContext, useContext } from 'react';
import AuthStore from './authStore';
import ModalStore from './modalStore';

interface Store {
  activityStore: ActivityStore;
  authStore: AuthStore;
  modalStore: ModalStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  authStore: new AuthStore(),
  modalStore: new ModalStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
