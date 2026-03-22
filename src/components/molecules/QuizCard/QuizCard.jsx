import "./QuizCard.css";

export default function QuizCard({ quiz, onEdit, onDelete, onPlay, onInvite }) {
  return (
    <div className="quiz-card-profile">
      <img
        src={quiz.imageUrl || "/default-quiz.png"}
        alt={quiz.title}
        className="quiz-card-image"
      />

      <div className="quiz-card-info">
        <h3>{quiz.title}</h3>
        <p className="quiz-card-topic">{quiz.topic || "Tema personalizado"}</p>

        <div className="quiz-card-buttons">
          <button className="edit-btn" onClick={() => onEdit(quiz.id)}>✏ Editar</button>
          <button className="delete-btn" onClick={() => onDelete(quiz.id)}>🗑 Eliminar</button>

          {/* ⭐ INVITAR → ruta correcta */}
          <button className="invite-btn" onClick={() => onInvite(quiz.id)}>
            
            🤝 Invitar
          </button>

          {/* ⭐ JUGAR SOLO */}
          <button className="play-btn" onClick={() => onPlay(quiz.id)}>
            ▶ Jugar Solo
          </button>
        </div>
      </div>
    </div>
  );
}
