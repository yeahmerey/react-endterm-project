const API = "https://rickandmortyapi.com/api/character";

export async function getListOrSearchLogic({
  q,
  status,
  gender,
  species,
  page,
}) {
  const params = new URLSearchParams();

  if (q) params.set("name", q);
  if (status) params.set("status", status);
  if (gender) params.set("gender", gender);
  if (species) params.set("species", species);
  if (page) params.set("page", page);

  const res = await fetch(`${API}/?${params.toString()}`);

  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error("Fail loading items");
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
