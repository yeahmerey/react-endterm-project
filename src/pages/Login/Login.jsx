import "./Login.css";
import { useState } from "react";
import { useAuth } from "../../context/useAuth.js";
import { Navigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGooglePopup } from "../../services/authService.js";

export default function Login() {
  const user = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/profile" />;
  }
  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGooglePopup();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h2> Login </h2>
      <div>
        <input
          type={"email"}
          placeholder={"Enter your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={"password"}
          placeholder={"Enter your password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <button onClick={handleLogin} disabled={loading}>
          {" "}
          Login{" "}
        </button>
        <button onClick={handleGoogleLogin} disabled={loading}>
          {" "}
          Sign in with Google{" "}
        </button>

        <p>
          Don't have an account? ...{" "}
          <Link id="signup-text" to={"/signup"}>
            Signup
          </Link>
        </p>
      </div>
    </>
  );
}
