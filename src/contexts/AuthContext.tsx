import { useState, useMemo, type ReactNode } from "react";
import { getToken, saveToken, clearToken, getUserFromToken } from "../utils/auth";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const user = useMemo(() => getUserFromToken(token), [token]);

  const login = (newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    clearToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
