import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

import QuizCard from "../../components/molecules/QuizCard/QuizCard";
import StatCard from "../../components/molecules/StatCard/StatCard";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return navigate("/homepage/login");

    const parsed = JSON.parse(savedUser);
    if (!parsed?.id) return navigate("/homepage/login");

    setUser(parsed);
    setAvatar(localStorage.getItem("avatar"));

    fetch(`http://localhost:8080/api/quizzes/user/${parsed.id}`)
      .then(async res => res.ok ? res.json() : [])
      .then(data => setMyQuizzes(data))
      .catch(() => setMyQuizzes([]));
  }, [navigate]);

  const handleDeleteQuiz = id => {
    if (!window.confirm("¿Seguro?")) return;

    fetch(`http://localhost:8080/api/quizzes/${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (res.ok) {
          setMyQuizzes(prev => prev.filter(q => q.id !== id));
        }
      });
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={avatar || "/default-avatar.png"} className="avatar" />
        <h1>{user.username}</h1>
        <p>{user.email}</p>
      </div>

      <div className="stats-section">
        <StatCard label="Quizzes creados" value={myQuizzes.length} />
        <StatCard label="Victorias" value={0} />
      </div>

      <h2>Mis Quizzes</h2>

      <div className="quiz-list">
        {myQuizzes.map(quiz => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}

            // ⭐ EDITAR
            onEdit={() => navigate(`/homepage/create-quiz/${quiz.id}`)}

            // ⭐ ELIMINAR
            onDelete={() => handleDeleteQuiz(quiz.id)}

            // ⭐ JUGAR SOLO
            onPlay={() => navigate(`/play/quiz/${quiz.id}`)}

            // ⭐ INVITAR → RUTA CORRECTA
            onInvite={() => navigate(`/homepage/create-room?quizId=${quiz.id}`)}

          />
        ))}
      </div>

      <button
        className="create-quiz-btn"
        onClick={() => navigate("/homepage/create-quiz")}
      >
        ➕ Crear nuevo Quiz
      </button>
    </div>
  );
}
