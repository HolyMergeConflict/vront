import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  return isAuthed ? <>{children}</> : <Navigate to="/login" replace />;
}
