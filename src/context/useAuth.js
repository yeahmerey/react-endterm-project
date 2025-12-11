import { useContext } from "react";
import { AuthContext } from "./AuthContextCreate.jsx";
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("no context provided");
  return context;
}
