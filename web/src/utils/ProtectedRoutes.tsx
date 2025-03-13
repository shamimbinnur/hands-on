import { Outlet, Navigate } from "react-router";
import useAuthStore from "../store/auth";

export default function ProtectedRoutes() {
  const { user } = useAuthStore();

  return user ? <Outlet /> : <Navigate to="/login" />;
}
