import { LoginData, RegisterData } from "./../models/user";
import { makeAutoObservable, reaction } from "mobx";
import { User } from "../models/user";
import { authApi } from "../api/agent";
import { appBrowserHistory } from "../../routing/AppRouter";
import { store } from "./store";

export default class AuthStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      this.setUser(JSON.parse(userFromLocalStorage));
    }

    reaction(
      () => this.user,
      (user) => {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", user.token);
          appBrowserHistory.replace("/activities");
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          appBrowserHistory.replace("/");
        }
        store.modalStore.closeModal();
      }
    );
  }

  setUser = (user: User | null) => (this.user = user);

  login = async (loginData: LoginData) => {
    try {
      const response = await authApi.login(loginData);
      this.setUser(response.data);
    } catch (e: any) {
      this.setUser(null);
    }
  };

  register = async (registerData: RegisterData) => {
    try {
      const response = await authApi.register(registerData);
      this.setUser(response.data);
    } catch (e: any) {
      this.setUser(null);
      throw e;
    }
  };

  logout = () => {
    this.setUser(null);
  };

  facebookLogin = () => {
    FB.login(
      (response) => {
        console.log(response);
      },
      { scope: "public_profile,email" }
    );
  };

  get authenticated() {
    return !!this.user;
  }

  setImage = (image: string) => {
    if (this.user) {
      this.user.image = image;
      localStorage.setItem("user", JSON.stringify(this.user));
    }
  };

  setDisplayName = (displayName: string) => {
    if (this.user) {
      this.user.displayName = displayName;
      localStorage.setItem("user", JSON.stringify(this.user));
    }
  };
}
