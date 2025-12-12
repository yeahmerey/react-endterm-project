import "./Favorites.css";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  const [sortBy, setSortBy] = useState("name"); // новое: сортировка

  // ============================================
  // useCallback - кешируем функцию загрузки
  // ============================================
  // Зачем: чтобы функция не пересоздавалась при каждом рендере.
  // Это важно потому что мы используем ее в useEffect ниже.
  const loadFavorites = useCallback(async () => {
    if (favorites.length === 0) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await getCharactersByIds(favorites);
      setItems(results);
    } catch (e) {
      setError(`Failed to load favorites: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [favorites]); // зависит только от favorites

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // ============================================
  // useMemo - кешируем отсортированный список
  // ============================================
  // Зачем: сортировка может быть дорогой операцией,
  // особенно если список большой. Мы не хотим сортировать
  // при каждом рендере, только когда меняются items или sortBy.
  const sortedItems = useMemo(() => {
    const itemsCopy = [...items];

    switch (sortBy) {
      case "name":
        return itemsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case "status":
        return itemsCopy.sort((a, b) => a.status.localeCompare(b.status));
      case "species":
        return itemsCopy.sort((a, b) => a.species.localeCompare(b.species));
      default:
        return itemsCopy;
    }
  }, [items, sortBy]);

  // ============================================
  // useMemo - кешируем статистику
  // ============================================
  // Зачем: подсчет статистики - это вычисление,
  // которое нужно делать только когда меняется items.
  const stats = useMemo(() => {
    const alive = items.filter((item) => item.status === "Alive").length;
    const dead = items.filter((item) => item.status === "Dead").length;
    const unknown = items.filter((item) => item.status === "unknown").length;

    return { alive, dead, unknown, total: items.length };
  }, [items]);

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
      {/* Заголовок с счетчиком */}
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <span className="favorites-count">
          {favorites.length} character{favorites.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Статистика (используем useMemo) */}
      <div className="favorites-stats">
        <div className="stat-item">
          <span className="stat-icon">✅</span>
          <span>Alive: {stats.alive}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💀</span>
          <span>Dead: {stats.dead}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">❓</span>
          <span>Unknown: {stats.unknown}</span>
        </div>
      </div>

      {/* Сортировка */}
      <div className="sort-controls">
        <label htmlFor="sort-select">Sort by: </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="species">Species</option>
        </select>
      </div>

      {/* Список (используем sortedItems из useMemo) */}
      <ul className="favorites-list">
        {sortedItems.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
