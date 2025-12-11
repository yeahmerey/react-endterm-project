import { auth } from "../services/authService.js";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContextCreate.jsx";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
