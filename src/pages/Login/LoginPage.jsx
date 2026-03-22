import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");   // ← CORREGIDO
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })   // ← CORRECTO
    });

    if (!res.ok) return alert("Credenciales incorrectas");

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/homepage/profile");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Iniciar Sesión</h2>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            className="auth-input"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="auth-button" type="submit">
            Entrar
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/homepage/register")}>Regístrate aquí</span>
        </p>

        <button onClick={() => {
  localStorage.removeItem("user");
  navigate("/homepage/login");
}}>
  Cerrar sesión
</button>

      </div>
    </div>
  );
}
