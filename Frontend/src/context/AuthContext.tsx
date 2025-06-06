// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Configuration de l'URL de l'API selon l'environnement
const API_BASE_URL = 'https://back-qhore.ondigitalocean.app/';


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
      console.log(`[AuthContext] Loading user from: ${API_BASE_URL}/api/me`);
      
      const response = await axios.get(`${API_BASE_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      setUser(response.data);
      setIsAuthenticated(true);
      await loadUserPermissions(token);
      
      console.log("[AuthContext] User loaded successfully:", response.data);
    } catch (error) {
      console.error("[AuthContext] Error loading user:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    } finally {
      setLoading(false);
    }
  };

  const loadUserPermissions = async (token: string) => {
    try {
      console.log(`[AuthContext] Loading permissions from: ${API_BASE_URL}/api/user/permissions`);
      
      const response = await axios.get(`${API_BASE_URL}/api/user/permissions`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      setPermissions(response.data.permissions || []);
      console.log("[AuthContext] Permissions loaded:", response.data.permissions);
    } catch (error) {
      console.error("[AuthContext] Error loading permissions:", error);
      setPermissions([]);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log(`[AuthContext] Attempting login to: ${API_BASE_URL}/api/login`);
      
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const { access_token, user } = response.data;
      
      if (!access_token) {
        throw new Error("Token d'accès manquant dans la réponse");
      }

      localStorage.setItem("access_token", access_token);
      setUser(user);
      setIsAuthenticated(true);
      await loadUserPermissions(access_token);
      
      console.log("[AuthContext] Login successful for user:", user);
    } catch (error) {
      console.error("[AuthContext] Login error:", error);
      
      // Relancer l'erreur pour que le composant Login puisse l'afficher
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      if (token) {
        console.log(`[AuthContext] Logging out from: ${API_BASE_URL}/api/logout`);
        
        // Optionnel: appeler l'endpoint de logout côté serveur
        await axios.post(`${API_BASE_URL}/api/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error("[AuthContext] Logout error:", error);
      // Continue même en cas d'erreur pour nettoyer le côté client
    } finally {
      // Nettoyage côté client
      localStorage.removeItem("access_token");
      setUser(null);
      setPermissions([]);
      setIsAuthenticated(false);
      
      console.log("[AuthContext] User logged out successfully");
    }
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
