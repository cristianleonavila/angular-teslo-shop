import { User } from "./user";

export interface SignupResponse {
  user:  User;
  token: string;
}
