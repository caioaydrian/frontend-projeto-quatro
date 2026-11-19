import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export function AuthRequiredLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthRequiredLayout;
