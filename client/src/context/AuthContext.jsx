/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import api, { getApiMessage } from "../api/axiosInstance";

const AuthContext = createContext(null);
const USER_KEY = "mystore-user";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await api.get("/auth/me");
        if (isMounted) persistUser(response.data.payload.user);
      } catch {
        if (isMounted) persistUser(null);
      } finally {
        if (isMounted) setIsCheckingSession(false);
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const loggedInUser =
        response.data.payload.user || response.data.payload.withoutPassword;
      persistUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      throw new Error(getApiMessage(error, "Login failed"));
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const response = await api.post("/auth/admin-login", credentials);
      const loggedInUser = response.data.payload.user;
      persistUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      throw new Error(getApiMessage(error, "Admin login failed"));
    }
  };

  const updateProfile = async (userId, formData) => {
    try {
      const response = await api.put(`/users/${userId}`, formData);
      const updatedUser = response.data.payload.updatedUser;
      persistUser({ ...user, ...updatedUser });
      return updatedUser;
    } catch (error) {
      throw new Error(getApiMessage(error, "Profile update failed"));
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Local session is cleared either way so the UI cannot get stuck.
    } finally {
      persistUser(null);
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post("/users/register", formData);
      return response.data.payload;
    } catch (error) {
      throw new Error(getApiMessage(error, "Registration failed"));
    }
  };

  const verifyAccount = async (token) => {
    try {
      const response = await api.post("/users/verify", { token });
      return response.data.payload.user;
    } catch (error) {
      throw new Error(getApiMessage(error, "Verification failed"));
    }
  };

  const value = {
    user,
    isAdmin: Boolean(user?.isAdmin),
    isCheckingSession,
    login,
    adminLogin,
    logout,
    register,
    verifyAccount,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
