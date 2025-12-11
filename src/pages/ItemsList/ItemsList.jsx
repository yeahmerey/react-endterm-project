import "./ItemsList.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Spinner from "../../components/Spinner/Spinner.jsx";
import ErrorBox from "../../components/ErrorBox/ErrorBox.jsx";
import Card from "../../components/Card/Card.jsx";
import { getListOrSearchLogic } from "../../services/apiService.js";

export default function ItemsList() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getListOrSearchLogic(q);
        setItems(data);
      } catch (e) {
        setError(`Ошибка загрузки ${e}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q]);

  function handleSearch(e) {
    setParams({ q: e.target.value });
  }

  return (
    <>
      <div className="api-doc">
        <h3>Rick & Morty API Documentation</h3>

        <code className="api-code">
          GET https://rickandmortyapi.com/api/character
        </code>

        <p>
          This endpoint returns a list of characters.
          <br />
          Use query parameters to filter:
        </p>

        <ul>
          <li>
            <code>?name=rick</code> – search by name
          </li>
          <li>
            <code>?status=alive</code> – filter by status
          </li>
          <li>
            <code>?page=2</code> – pagination
          </li>
        </ul>
      </div>

      <div className="search-wrapper">
        <input
          className="modern-input"
          value={q}
          onChange={handleSearch}
          placeholder="Search..."
        />
        {loading && <Spinner />}
        {error && <ErrorBox />}
      </div>

      <ul className="list">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>
    </>
  );
}
