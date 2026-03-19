import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinRoomPage.css";

export default function JoinRoomPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Debes iniciar sesión");

    const res = await fetch(`http://localhost:8080/api/rooms/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id })
    });

    if (res.ok) navigate(`/game/${code}`);
    else alert("Código inválido");
  };

  return (
    <div className="join-page fade-in">
      <div className="join-card pop">
        <h2 className="join-title">Unirse a Sala</h2>

        <input
          className="join-input"
          placeholder="Código de sala"
          value={code}
          onChange={e => setCode(e.target.value)}
        />

        <button className="join-btn" onClick={handleJoin}>
          Entrar
        </button>
      </div>
    </div>
  );
}
