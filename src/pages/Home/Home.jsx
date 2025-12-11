import "./Home.css";
import myImg from "../../assets/images.png";

export default function Home() {
  return (
    <div className="home-container">
      <img src={myImg} alt="" className="home-image" />

      <div className="home-text">
        <h1>Rick And Morty</h1>
      </div>
    </div>
  );
}
