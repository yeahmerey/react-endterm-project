import { auth } from "../services/authService.js";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContextCreate.jsx";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
