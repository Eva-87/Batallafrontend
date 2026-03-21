import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/atoms/Input/Input";
import Button from "../../components/atoms/Button/Button";
import Title from "../../components/atoms/Title/Title";
import "./CreateRoomPage.css";

export default function CreateRoomPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const params = new URLSearchParams(window.location.search);
  const initialQuizId = params.get("quizId");

  useEffect(() => {
    fetch("http://localhost:8080/api/quizzes")
      .then(res => res.json())
      .then(data => {
        setQuizzes(data);

        if (initialQuizId) {
          setQuizId(initialQuizId);
        } else if (data.length > 0) {
          setQuizId(data[0].id.toString());
        }
      });
  }, [initialQuizId]);

  const handleCreate = async () => {
    if (!user) return alert("Debes iniciar sesión");

    const payload = {
      userId: Number(user.id),
      quizId: Number(quizId),
      maxPlayers: Number(maxPlayers)
    };

    console.log("ENVIANDO PAYLOAD:", payload);

    const res = await fetch("http://localhost:8080/api/rooms/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("ERROR BACKEND:", text);
      return alert("Error creando sala");
    }

    const room = await res.json();
    navigate(`/game/${room.code}`);
  };

  return (
    <div className="create-room-wrapper fade-in">
      <div className="create-room-card pop">
        <Title>🎮 Crear Sala</Title>

        <div className="form-group">
          <label className="label">Selecciona un Quiz:</label>
          <select
            className="select-input fancy-select"
            value={quizId}
            onChange={e => setQuizId(e.target.value)}
          >
            {quizzes.map(quiz => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title} — {quiz.topic}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="label">Máx jugadores:</label>
          <Input
            type="number"
            min="2"
            max="20"
            value={maxPlayers}
            onChange={e => setMaxPlayers(Number(e.target.value))}
          />
        </div>

        <Button className="create-room-btn" onClick={handleCreate}>
          🚀 Crear Sala
        </Button>
      </div>
    </div>
  );
}
