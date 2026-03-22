import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Logo from "../atoms/Logo/Logo";
import Button from "../atoms/Button/Button";
import Title from "../atoms/Title/Title";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* IZQUIERDA: LOGO + TÍTULO */}
      <div className="navbar-left">
        <Logo size={60} />
        <h1 className="navbar-title">BATALLA DE SABIOS</h1>
      </div>

      {/* CENTRO: BUSCADOR */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Buscar por tópico..."
          className="search-input"
        />
      </div>

      {/* DERECHA: BOTONES */}
      <div className="navbar-right">
        <Button onClick={() => navigate("/homepage/login")}>
          Iniciar Sesión
        </Button>

        <Button onClick={() => navigate("/homepage/join-room")}>
          Unirse a una Sala
        </Button>
      </div>
    </nav>
  );
}
