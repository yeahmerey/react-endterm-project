import { useAuth } from "../../context/useAuth.js";
import { Navigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
