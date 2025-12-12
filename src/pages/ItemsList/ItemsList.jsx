import "./ItemsList.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import Spinner from "../../components/Spinner/Spinner.jsx";
import ErrorBox from "../../components/ErrorBox/ErrorBox.jsx";
import Card from "../../components/Card/Card.jsx";
import { getListOrSearchLogic } from "../../services/apiService.js";
import { useFavorites } from "../../context/useFavorites.js";

import { useDebounce } from "../../hooks/useDebounce.jsx";

export default function ItemsList() {
  const [params, setParams] = useSearchParams();
  const { mergeMessage } = useFavorites();

  const q = params.get("q") || "";
  const status = params.get("status") || "";
  const gender = params.get("gender");
  const species = params.get("species");
  const page = Number(params.get("page") || 1);
  const limit = Number(params.get("limit") || 10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);

  const debouncedQ = useDebounce(q, 400);

  const filters = useMemo(
    () => ({
      q: debouncedQ, // используем задебаунсенное значение!
      status,
      gender,
      species,
      page,
    }),
    [debouncedQ, status, gender, species, page]
  );

  // ============================================
  // useCallback - кешируем функцию updateParam
  // ============================================
  // Зачем: чтобы функция не пересоздавалась при каждом рендере.
  // Это полезно если мы передаем ее в дочерние компоненты.
  const updateParam = useCallback(
    (name, value) => {
      const newParams = new URLSearchParams(params.toString());
      if (value) {
        newParams.set(name, value);
      } else {
        newParams.delete(name);
      }
      // Сбрасываем на первую страницу при изменении фильтров
      if (name !== "page") {
        newParams.set("page", "1");
      }
      setParams(newParams);
    },
    [params, setParams]
  );

  // ============================================
  // useEffect - загружаем данные
  // ============================================
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getListOrSearchLogic(filters);
        setItems(data.slice(0, limit));
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(`Ошибка загрузки: ${e.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [filters, limit]); // зависим от filters (который сам зависит от debouncedQ)

  // ============================================
  // useMemo - кешируем отфильтрованные элементы
  // ============================================
  // Зачем: если у нас большой список, нет смысла делать slice
  // при каждом рендере, если limit не изменился.
  const displayItems = useMemo(() => {
    return items.slice(0, limit);
  }, [items, limit]);
  // const filters = useMemo(
  //   () => ({
  //     q: debouncedQ,
  //     status,
  //     gender,
  //     species,
  //     page,
  //   }),
  //   [debouncedQ, status, gender, species, page]
  // );

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const timeout = setTimeout(async () => {
  //     setLoading(true);
  //     setError("");
  //     try {
  //       const data = await getListOrSearchLogic({
  //         q,
  //         status,
  //         gender,
  //         species,
  //         page,
  //       });
  //       setItems(data.slice(0, limit));
  //     } catch (e) {
  //       setError(`Ошибка загрузки ${e}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, 400);
  //   return () => {
  //     controller.abort();
  //     clearTimeout(timeout);
  //   };
  // }, [q, status, gender, species, page, limit]);

  // function updateParam(name, value) {
  //   const newParams = new URLSearchParams(params.toString());
  //   if (value) {
  //     newParams.set(name, value);
  //   } else {
  //     newParams.delete(name);
  //   }
  //   if (name !== "page") {
  //     newParams.set("page", "1");
  //   }

  //   setParams(newParams);
  // }

  //   const load = async () => {
  //     setLoading(true);
  //     setError("");

  //     try {
  //       const data = await getListOrSearchLogic(q);
  //       setItems(data);
  //     } catch (e) {
  //       setError(`Ошибка загрузки ${e}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   load();
  // }, [q]);

  // function handleSearch(e) {
  //   setParams({ q: e.target.value });
  // }

  return (
    <>
      {/* Сообщение о мерже локальных избранных */}
      {mergeMessage && <div className="merge-message">✅ {mergeMessage}</div>}

      {/* API документация */}
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
          onChange={(e) => updateParam("q", e.target.value)}
          placeholder="Search characters... (debounced 400ms)"
        />

        <select
          value={status}
          onChange={(e) => updateParam("status", e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          value={gender}
          onChange={(e) => updateParam("gender", e.target.value)}
        >
          <option value="">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          value={species}
          onChange={(e) => updateParam("species", e.target.value)}
        >
          <option value="">All species</option>
          <option value="human">Human</option>
          <option value="alien">Alien</option>
        </select>

        <select
          value={limit}
          onChange={(e) => updateParam("limit", e.target.value)}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>

        {loading && <Spinner />}
        {error && <ErrorBox message={error} />}
      </div>

      <ul className="list">
        {displayItems.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => updateParam("page", page - 1)}
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => updateParam("page", page + 1)}>Next</button>
      </div>
    </>
  );
}
