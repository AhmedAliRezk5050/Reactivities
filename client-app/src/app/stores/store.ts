import ActivityStore from './activityStore';
import { createContext, useContext } from 'react';
import AuthStore from './authStore';

interface Store {
  activityStore: ActivityStore;
  authStore: AuthStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  authStore: new AuthStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => useContext(StoreContext);
