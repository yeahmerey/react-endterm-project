import { useAuth } from "../../context/useAuth.js";
import { Navigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner.jsx";

export default function ProtectedRoute({ children }) {
  const user = useAuth();
  if (user === null) {
    return <Spinner />;
  }
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
