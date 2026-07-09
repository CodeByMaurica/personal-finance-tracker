import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import type { User } from "../types";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const savedUser = localStorage.getItem("finance_user");

  const [user, setUser] = useState<User | null>(
    savedUser ? JSON.parse(savedUser) : null
  );

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    localStorage.setItem("finance_token", response.data.token);
    localStorage.setItem("finance_user", JSON.stringify(response.data.user));

    setUser(response.data.user);
  }

  async function registerUser(name: string, email: string, password: string) {
    await api.post("/auth/register", {
      name,
      email,
      password
    });

    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("finance_token");
    localStorage.removeItem("finance_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}