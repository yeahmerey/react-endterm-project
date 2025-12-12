import { useContext } from "react";
import { AuthContext } from "./AuthContextCreate.jsx";
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
