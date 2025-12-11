import "./Card.css";
import { useNavigate } from "react-router-dom";

export default function Card({ item }) {
  const navigate = useNavigate();

  return (
    <li className="card" onClick={() => navigate(`/itemsList/${item.id}`)}>
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>Status: {item.status}</p>

      <div className="detail-hover">Origin: {item.origin?.name}</div>
    </li>
  );
}
