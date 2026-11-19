import { useState, useEffect, useCallback, type ReactNode } from "react";
import {
  getToken,
  saveToken,
  clearToken,
  getUserFromToken,
  getStoredUser,
  saveStoredUser,
} from "../utils/auth";
import { AuthContext } from "./useAuth";
import { getUserById } from "../services/users";
import type { User } from "../types/user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStoredUser();
    if (stored) return stored;
    const initialToken = getToken();
    return initialToken ? getUserFromToken(initialToken) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserFullData = useCallback(async (userId: number): Promise<User | null> => {
    try {
      const fullUser = await getUserById(userId);
      setUser(fullUser);
      saveStoredUser(fullUser);
      return fullUser;
    } catch (err) {
      console.error("Failed to sync current user profile:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    async function initUser() {
      if (!token) {
        if (isCurrent) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const tokenUser = getUserFromToken(token);
      if (!tokenUser) {
        if (isCurrent) {
          clearToken();
          setToken(null);
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const fullUser = await getUserById(tokenUser.id);
        if (isCurrent) {
          setUser(fullUser);
          saveStoredUser(fullUser);
        }
      } catch {
        if (isCurrent) {
          setUser((prev) => {
            const fallback = prev || getStoredUser() || tokenUser;
            saveStoredUser(fallback);
            return fallback;
          });
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    initUser();

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const login = (newToken: string, initialUser?: User) => {
    saveToken(newToken);
    setToken(newToken);

    const tokenUser = getUserFromToken(newToken);
    const resolvedUser = initialUser || tokenUser;

    if (resolvedUser) {
      setUser(resolvedUser);
      saveStoredUser(resolvedUser);
      fetchUserFullData(resolvedUser.id);
    }
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  const updateCurrentUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: User = { ...prev, ...updatedFields };
      saveStoredUser(updated);
      return updated;
    });
  };

  const refreshUser = async (): Promise<User | null> => {
    if (!user?.id) return null;
    return await fetchUserFullData(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateCurrentUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
