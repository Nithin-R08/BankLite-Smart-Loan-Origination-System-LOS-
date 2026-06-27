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
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("banklite_token"));
  const [role, setRole] = useState<UserRole | null>(sessionStorage.getItem("banklite_role") as UserRole);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        setRole(res.data.role);
        sessionStorage.setItem("banklite_role", res.data.role);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem("banklite_token");
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

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      if (res.success && res.data) {
        const { access_token, role: userRole } = res.data;
        sessionStorage.setItem("banklite_token", access_token);
        sessionStorage.setItem("banklite_role", userRole);
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
    sessionStorage.removeItem("banklite_token");
    sessionStorage.removeItem("banklite_role");
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
