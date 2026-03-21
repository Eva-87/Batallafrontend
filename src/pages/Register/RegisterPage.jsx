import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // 👈 por defecto
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }) // 👈 AÑADIDO
    });

    if (!res.ok) return alert("Error al registrar");

    // LOGIN — ahora usa username, no email
    const loginRes = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }) // 👈 CORREGIDO
    });

    if (!loginRes.ok) return alert("Error al iniciar sesión");

    const data = await loginRes.json();
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/homepage/profile");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Registro</h2>

        <form onSubmit={handleRegister} className="auth-form">
          <input
            className="auth-input"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {/* Selector de rol */}
          <select
            className="auth-input"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="USER">Usuario</option>
            <option value="CREATOR">Creador</option>
          </select>

          <button className="auth-button" type="submit">
            Registrarse
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/homepage/login")}>Inicia sesión</span>
        </p>
      </div>
    </div>
  );
}
