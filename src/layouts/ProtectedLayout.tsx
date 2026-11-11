import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/auth";

export function ProtectedLayout() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;
