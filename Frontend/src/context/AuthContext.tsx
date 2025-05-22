// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  permissions: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      await loadUser(accessToken);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const loadUser = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setIsAuthenticated(true);
      await loadUserPermissions(token);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  };

  const loadUserPermissions = async (token: string) => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(response.data.permissions || []);
    } catch (error) {
      setPermissions([]);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);
      setUser(user);
      setIsAuthenticated(true);
      await loadUserPermissions(access_token);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, permissions, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
