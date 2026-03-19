import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">TriviaApp</h2>
      <div className="links">
        <Link to="/">Inicio</Link>
        <Link to="/quiz/create">Crear Quiz</Link>
        <Link to="/room/create">Crear Sala</Link>
        <Link to="/room/join">Unirse</Link>
        <Link to="/profile">Perfil</Link>
      </div>
    </nav>
  );
}
