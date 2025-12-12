import "./Profile.css";
import { useAuth } from "../../context/useAuth.js";
import Spinner from "../../components/Spinner/Spinner.jsx";
import LogoutButton from "../../components/LogoutButton/LogoutButton.jsx";
import { useFavorites } from "../../context/useFavorites.js";
export default function Profile() {
  const user = useAuth();
  const { favorites } = useFavorites();
  if (!user) return <p>{<Spinner />}</p>;

  return (
    <>
      <p className="info">Salem , {user.displayName || "Guest"}</p>
      <p className="info">User UID : {user.uid}</p>
      <p className="info">User Email : {user.email} </p>

      <div className="favorites-section">
        <h3>Your Favorites</h3>
        {favorites.length === 0 ? (
          <p>No favorites yet. Start adding some!</p>
        ) : (
          <p>You have {favorites.length} favorite character(s).</p>
        )}
      </div>

      <LogoutButton />
    </>
  );
}
