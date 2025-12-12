import "./Profile.css";
import { useAuth } from "../../context/useAuth.js";
import Spinner from "../../components/Spinner/Spinner.jsx";
import LogoutButton from "../../components/LogoutButton/LogoutButton.jsx";
export default function Profile() {
  const user = useAuth();

  if (!user) return <p>{<Spinner />}</p>;

  return (
    <>
      <p className="info">Salem , {user.displayName || "Guest"}</p>
      <p className="info">User UID : {user.uid}</p>
      <p className="info">User Email : {user.email} </p>
      <LogoutButton />
    </>
  );
}
