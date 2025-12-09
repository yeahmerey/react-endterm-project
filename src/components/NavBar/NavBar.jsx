import "./NavBar.css";
import { NavLink } from "react-router-dom";
// import icon from "../../assets/icon.png";
export default function NavBar() {
  return (
    <nav className="nav">
      <NavLink to="/">
        Home
        {/* <img
          src={icon}
          alt="Home"
          style={{ width: "100px", height: "100px", paddingRight: "600px" }}
        ></img> */}
      </NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/signup">Signup</NavLink>
    </nav>
  );
}
