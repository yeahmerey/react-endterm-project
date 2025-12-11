import "./LogoutButton.css";

import { auth } from "../../services/authService.js";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setErr("");
    try {
      await signOut(auth);
      navigate("/login");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <>
      <button onClick={handleLogout}>Logout</button>
      {err && <p style={{ color: "red" }}>{err}</p>}
    </>
  );
}
