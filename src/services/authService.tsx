import api from "./apiClient";
import endpoints from "../config/endpoints";
import { TokenResponse } from "../types/api";

export default {
  async login(payload: {
    username: string;
    password: string;
  }): Promise<string> {
    const data = await api.post<TokenResponse>(endpoints.auth.login, payload);
    return data?.access_token || (data as any)?.token || (data as any);
  },
  async register(payload: {
    email: string;
    password: string;
    username: string;
  }) {
    return api.post(endpoints.auth.register, payload);
  },
  async me() {
    return api.get(endpoints.auth.me);
  },
  async logout() {
    try {
      return await api.post(endpoints.auth.logout);
    } catch {
      return;
    }
  },
};
