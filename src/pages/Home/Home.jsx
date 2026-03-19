import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Title from "../../components/atoms/Title/Title";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // 🔥 FETCH ROBUSTO (evita errores de JSON vacío)
    fetch("http://localhost:8080/api/quizzes")
      .then(async res => {
        if (!res.ok) {
          console.error("Error al cargar quizzes:", res.status);
          return []; // evita que .json() explote
        }
        return res.json();
      })
      .then(data => setQuizzes(data))
      .catch(err => {
        console.error("Error de red:", err);
        setQuizzes([]);
      });
  }, []);

  const getQuizImage = quiz => {
    if (quiz.imageUrl) return quiz.imageUrl;
    if (quiz.image) return `http://localhost:8080/${quiz.image}`;
    if (quiz.imagePath) return `http://localhost:8080${quiz.imagePath}`;
    return "/default-quiz.png";
  };

  return (
    <div className="home-container">
      <Title>Batalla de Sabios</Title>

      <div className="home-buttons">
        <button onClick={() => navigate("/homepage/register")}>Registrarse</button>
        <button onClick={() => navigate("/homepage/login")}>Iniciar sesión</button>
        <button onClick={() => navigate("/homepage/create-quiz")}>Crear Quiz</button>
      </div>

      <div className="home-buttons">
        <button onClick={() => navigate("/homepage/create-room")}>Crear sala</button>
        <button onClick={() => navigate("/homepage/join-room")}>Unirse a sala</button>
      </div>

      <h2 className="quiz-title">Quizzes disponibles</h2>

      <div className="quiz-grid">
        {quizzes.map(quiz => (
          <div
            key={quiz.id}
            className="quiz-card"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
          >
            <img className="quiz-image" src={getQuizImage(quiz)} alt={quiz.title} />
            <h3>{quiz.title}</h3>
            <p>{quiz.topic || "Tema personalizado"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
