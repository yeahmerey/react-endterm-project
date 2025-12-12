import "./Signup.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/authService.js";
import { useAuth } from "../../context/useAuth.js";
import { useEffect } from "react";
export default function Signup() {
  const user = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const hasNumber = password.split("").some((ch) => !isNaN(ch));

    if (!hasNumber) {
      setError("Password must contain at least one number.");
      return;
    }

    const specialSymbols = "!@#$%^&*";
    const hasSpecial = password
      .split("")
      .some((ch) => specialSymbols.includes(ch));
    if (!hasSpecial) {
      setError("Password must include a special character (!@#$%^&*)");
      return;
    }

    if (password != confirmPass) {
      setError("Password doesn't match");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  return (
    <>
      <p>Signup page</p>
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm your password"
          onChange={(e) => setConfirmPass(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <button onClick={handleSignup}>Sign Up</button>
      </div>

      <p>
        Already have an account? ... <Link to="/login">Login</Link>
      </p>
    </>
  );
}
