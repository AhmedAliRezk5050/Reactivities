export interface User {
  displayName: string;
  userName: string;
  image: string;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData extends LoginData {
  displayName: string;
  userName: string;
}
