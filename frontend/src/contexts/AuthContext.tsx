import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserRole } from "../types";
import { authService } from "../services/auth";
import type { LoginData, RegisterData, UpdateProfileData } from "../services/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("banklite_token"));
  const [role, setRole] = useState<UserRole | null>(localStorage.getItem("banklite_role") as UserRole);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        setRole(res.data.role);
        localStorage.setItem("banklite_role", res.data.role);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("banklite_token");
      if (storedToken) {
        setToken(storedToken);
        await refreshUser();
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Set isLoading to false when user state changes or is resolved
  useEffect(() => {
    if (token && user) {
      setIsLoading(false);
    } else if (!token) {
      setIsLoading(false);
    }
  }, [token, user]);

  // Sync authentication state across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "banklite_token" || e.key === "banklite_role") {
        const newToken = localStorage.getItem("banklite_token");
        const newRole = localStorage.getItem("banklite_role") as UserRole;
        
        if (!newToken) {
          setToken(null);
          setUser(null);
          setRole(null);
          setIsLoading(false);
        } else {
          setToken(newToken);
          setRole(newRole);
          try {
            const res = await authService.getMe();
            if (res.success && res.data) {
              setUser(res.data);
              setRole(res.data.role);
            } else {
              logout();
            }
          } catch {
            logout();
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      if (res.success && res.data) {
        const { access_token, role: userRole } = res.data;
        localStorage.setItem("banklite_token", access_token);
        localStorage.setItem("banklite_role", userRole);
        setToken(access_token);
        setRole(userRole);
        
        // Fetch full profile info
        const meRes = await authService.getMe();
        if (meRes.success && meRes.data) {
          setUser(meRes.data);
        }
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setIsLoading(false);
      if (!res.success) {
        throw new Error(res.message);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("banklite_token");
    localStorage.removeItem("banklite_role");
    setToken(null);
    setUser(null);
    setRole(null);
    setIsLoading(false);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const res = await authService.updateCustomerProfile(data);
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
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
