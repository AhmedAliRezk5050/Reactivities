import ActivityStore from './activityStore';
import { createContext, useContext } from 'react';
import AuthStore from './authStore';
import ModalStore from './modalStore';
import ProfileStore from './profileStore';

interface Store {
  activityStore: ActivityStore;
  authStore: AuthStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  authStore: new AuthStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
