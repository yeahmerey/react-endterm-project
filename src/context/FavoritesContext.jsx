import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { FavoritesContext } from "./FavoritesContextCreate.jsx";
import {
  getLocalFavorites,
  addToLocalFavorites,
  removeFromLocalFavorites,
  getFirestoreFavorites,
  addToFirestoreFavorites,
  removeFromFirestoreFavorites,
  mergeLocalToFirestore,
} from "../services/favoritesService";

export function FavoritesProvider({ children }) {
  const user = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [mergeMessage, setMergeMessage] = useState("");

  // Load favorites при монтировании или смене user
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        // Залогинен → загружаем из Firestore
        const firestoreFavs = await getFirestoreFavorites(user.uid);

        // Проверяем локальные
        const localFavs = getLocalFavorites();

        if (localFavs.length > 0) {
          // Есть локальные → мержим
          const count = await mergeLocalToFirestore(user.uid);
          if (count > 0) {
            setMergeMessage(
              `${count} local favorites merged into your account.`
            );
            setTimeout(() => setMergeMessage(""), 5000);
          }

          // Перезагружаем после мержа
          const updated = await getFirestoreFavorites(user.uid);
          setFavorites(updated);
        } else {
          setFavorites(firestoreFavs);
        }
      } else {
        // Не залогинен → загружаем локальные
        setFavorites(getLocalFavorites());
      }
    };

    loadFavorites();
  }, [user]);

  // Add favorite
  const addFavorite = async (itemId) => {
    if (user) {
      await addToFirestoreFavorites(user.uid, itemId);
      setFavorites((prev) => [...prev, itemId]);
    } else {
      addToLocalFavorites(itemId);
      setFavorites((prev) => [...prev, itemId]);
    }
  };

  // Remove favorite
  const removeFavorite = async (itemId) => {
    if (user) {
      await removeFromFirestoreFavorites(user.uid, itemId);
      setFavorites((prev) => prev.filter((id) => id !== itemId));
    } else {
      removeFromLocalFavorites(itemId);
      setFavorites((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Toggle favorite
  const toggleFavorite = async (itemId) => {
    if (favorites.includes(itemId)) {
      await removeFavorite(itemId);
    } else {
      await addFavorite(itemId);
    }
  };

  // Check if item is favorite
  const isFavorite = (itemId) => {
    return favorites.includes(itemId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        mergeMessage,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
