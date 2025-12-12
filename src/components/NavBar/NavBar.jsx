import "./NavBar.css";
import { NavLink } from "react-router-dom";
// import icon from "../../assets/icon.png";
import { signOut } from "firebase/auth";
import { useAuth } from "../../context/useAuth.js";
import { auth } from "../../services/authService.js";
import { useState } from "react";
import { useFavorites } from "../../context/useFavorites.js";
export default function NavBar() {
  const [err, setErr] = useState("");
  const user = useAuth();
  const { favorites } = useFavorites();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <nav className="nav">
      {err}
      <NavLink to="/">
        Home
        {/* <img
          src={icon}
          alt="Home"
          style={{ width: "100px", height: "100px", paddingRight: "600px" }}
        ></img> */}
      </NavLink>
      <NavLink to="/itemsList">Items List</NavLink>
      <NavLink to="/favorites" className="favorites-link">
        Favorites
        {favorites.length > 0 && (
          <span className="favorites-badge">{favorites.length}</span>
        )}
      </NavLink>
      {user ? (
        <>
          <NavLink to="profile">Profile</NavLink>
          <NavLink
            to="/login"
            onClick={handleSignOut}
            style={{ cursor: "pointer" }}
          >
            Logout
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </>
      )}
    </nav>
  );
}
