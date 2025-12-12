import "./Favorites.css";
import { useState, useEffect } from "react";
import { useFavorites } from "../../context/useFavorites.js";
import { getCharactersByIds } from "../../services/apiService.js";
import Card from "../../components/Card/Card.jsx";
import Spinner from "../../components/Spinner/Spinner.jsx";
import ErrorBox from "../../components/ErrorBox/ErrorBox.jsx";

export default function Favorites() {
  const { favorites } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Загружаем все избранные персонажи одним запросом
        const results = await getCharactersByIds(favorites);
        setItems(results);
      } catch (e) {
        setError(`Failed to load favorites: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  if (loading) {
    return (
      <div className="favorites-container">
        <h1>My Favorites</h1>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-container">
        <h1>My Favorites</h1>
        <ErrorBox message={error} />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <h1>My Favorites</h1>
        <div className="empty-state">
          <span className="empty-icon">💔</span>
          <h2>No favorites yet</h2>
          <p>Start adding characters to your favorites list!</p>
          <a href="/itemsList" className="browse-btn">
            Browse Characters
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <span className="favorites-count">
          {favorites.length} character{favorites.length !== 1 ? "s" : ""}
        </span>
      </div>

      <ul className="favorites-list">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
