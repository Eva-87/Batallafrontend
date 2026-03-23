import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

import QuizCard from "../../components/molecules/QuizCard/QuizCard";
import StatCard from "../../components/molecules/StatCard/StatCard";

import { uploadImage } from "../../services/imageService";

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
    setAvatar(parsed.avatarUrl || null);

    fetch(`http://localhost:8080/api/quizzes/user/${parsed.id}`)
      .then(async (res) => (res.ok ? res.json() : []))
      .then((data) => setMyQuizzes(data))
      .catch(() => setMyQuizzes([]));
  }, [navigate]);

  const handleDeleteQuiz = (id) => {
    if (!window.confirm("¿Seguro?")) return;

    fetch(`http://localhost:8080/api/quizzes/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.ok) {
        setMyQuizzes((prev) => prev.filter((q) => q.id !== id));
      }
    });
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img src={avatar || "/default-avatar.png"} className="avatar" />

          {/* input invisible encima del avatar */}
          <input
            type="file"
            accept="image/*"
            className="avatar-input"
           onChange={async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const url = await uploadImage(file);

    // 1. Guardar en backend
    await fetch(`http://localhost:8080/api/users/${user.id}/avatar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: url })
    });

    // 2. Guardar en localStorage
    const updatedUser = { ...user, avatarUrl: url };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // 3. Actualizar estado
    setUser(updatedUser);
    setAvatar(url);

    alert("Avatar actualizado");
  } catch (err) {
    alert("Error subiendo avatar");
  }
}}

          />
        </div>

        <h1>{user.username}</h1>
        <p>{user.email}</p>
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/homepage/login");
        }}
      >
        Cerrar sesión
      </button>

      <div className="stats-section">
        <StatCard label="Quizzes creados" value={myQuizzes.length} />
        <StatCard label="Victorias" value={user.wins || 0} />

      </div>

      <h2>Mis Quizzes</h2>

      <div className="quiz-list">
        {myQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onEdit={() => navigate(`/homepage/create-quiz/${quiz.id}`)}
            onDelete={() => handleDeleteQuiz(quiz.id)}
            onPlay={() => navigate(`/play/quiz/${quiz.id}`)}
            onInvite={() =>
              navigate(`/homepage/create-room?quizId=${quiz.id}`)
            }
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
