import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
} from "firebase/firestore";

const db = getFirestore();
const STORAGE_KEY = "rickmorty_favorites";

// ============================================
// LOCAL STORAGE (для не залогиненных)
// ============================================

export function getLocalFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading localStorage:", e);
    return [];
  }
}

export function saveLocalFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

export function addToLocalFavorites(itemId) {
  const favorites = getLocalFavorites();
  if (!favorites.includes(itemId)) {
    favorites.push(itemId);
    saveLocalFavorites(favorites);
  }
}

export function removeFromLocalFavorites(itemId) {
  let favorites = getLocalFavorites();
  favorites = favorites.filter((id) => id !== itemId);
  saveLocalFavorites(favorites);
}

export function clearLocalFavorites() {
  localStorage.removeItem(STORAGE_KEY);
}

// ============================================
// FIRESTORE (для залогиненных)
// ============================================

export async function getFirestoreFavorites(userId) {
  try {
    const collectionRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map((doc) => doc.id);
  } catch (e) {
    console.error("Error fetching Firestore favorites:", e);
    return [];
  }
}

export async function addToFirestoreFavorites(userId, itemId) {
  try {
    const docRef = doc(db, "users", userId, "favorites", String(itemId));
    await setDoc(docRef, { addedAt: new Date() });
  } catch (e) {
    console.error("Error adding to Firestore:", e);
  }
}

export async function removeFromFirestoreFavorites(userId, itemId) {
  try {
    const docRef = doc(db, "users", userId, "favorites", String(itemId));
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error removing from Firestore:", e);
  }
}

// ============================================
// MERGE LOCAL → FIRESTORE
// ============================================

export async function mergeLocalToFirestore(userId) {
  const localFavorites = getLocalFavorites();

  if (localFavorites.length === 0) return;

  try {
    for (const itemId of localFavorites) {
      await addToFirestoreFavorites(userId, itemId);
    }
    clearLocalFavorites();
    return localFavorites.length;
  } catch (e) {
    console.error("Error merging favorites:", e);
    return 0;
  }
}
