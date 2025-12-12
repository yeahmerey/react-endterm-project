import "./Card.css";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../context/useFavorites.js";
export default function Card({ item }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <li className="card" onClick={() => navigate(`/itemsList/${item.id}`)}>
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>Status: {item.status}</p>

      <button
        className={`favorite-btn ${isFavorite(item.id) ? "favorited" : ""}`}
        onClick={handleFavoriteClick}
        aria-label="Toggle favorite"
      >
        {isFavorite(item.id) ? "❤️" : "🤍"}
      </button>

      <div className="detail-hover">Origin: {item.origin?.name}</div>
    </li>
  );
}
