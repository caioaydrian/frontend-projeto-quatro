import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
