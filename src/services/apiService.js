const API = "https://rickandmortyapi.com/api/character";

export async function getListOrSearchLogic(query) {
  const url = query ? `${API}/?name=${query}` : API;
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    } else {
      throw new Error("Fail loading items");
    }
  }
  const data = await res.json();
  return data.results || [];
}

export async function getCharacterById(id) {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) {
    throw new Error("Item isn't found");
  }
  return await res.json();
}
