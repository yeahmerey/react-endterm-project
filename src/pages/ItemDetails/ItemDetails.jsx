import "./ItemDetails.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Spinner from "../../components/Spinner/Spinner.jsx";
import ErrorBox from "../../components/ErrorBox/ErrorBox.jsx";
import { getCharacterById } from "../../services/apiService.js";
export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getCharacterById(id);
        setItem(data);
      } catch (e) {
        setError(`Load Error ${e}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox />;
  if (!item) return <p>Not found</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>

      <h1>{item.name}</h1>
      <img src={item.image} alt={item.name} />

      <p className="detail">Status: {item.status}</p>
      <p className="detail">Species: {item.species}</p>
      <p className="detail">Gender: {item.gender}</p>
      <p className="detail">Origin: {item.origin?.name}</p>
      <p className="detail">Location: {item.location?.name}</p>
      <p className="detail">Episodes: {item.episode.length}</p>
    </div>
  );
}
