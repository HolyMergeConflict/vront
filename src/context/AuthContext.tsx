import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import * as storage from "../utils/storage";
import api from "../services/apiClient";
import authService from "../services/authService";
import { UserPublic } from "../types/api";

interface AuthCtx {
  token: string;
  user: UserPublic | null;
  isAuthed: boolean;
  saveToken: (t: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string>(() => storage.get("token") || "");
  const [user, setUser] = useState<UserPublic | null>(null);
  const navigate = useNavigate();
  const isAuthed = !!token;

  const saveToken = (t: string) => {
    setToken(t || "");
    storage.set("token", t);
    api.setToken(t);
  };
  const logout = () => {
    saveToken("");
    setUser(null);
    navigate("/login");
  };

  const fetchMe = async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await api.get<UserPublic>("/users/me");
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    api.setToken(token);
    fetchMe();
  }, [token]);

  const value = useMemo(
    () => ({ token, user, isAuthed, saveToken, logout }),
    [token, user, isAuthed],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
