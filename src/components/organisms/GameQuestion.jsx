import "./GameQuestion.css";

export default function GameQuestion({
  question,
  timeLeft,
  selectedIndex,
  hasAnswered,
  onAnswer
}) {

  // Protección contra datos incompletos
  if (!question || !question.options || question.options.length === 0) {
    return <p>Cargando pregunta...</p>;
  }

  return (
    <div className="question-container">
      <h2>{question.text}</h2>

      <div className="timer">Tiempo restante: {timeLeft}s</div>

      <div className="options">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-btn ${
              selectedIndex === idx ? "selected" : ""
            }`}
            disabled={hasAnswered}
            onClick={() => onAnswer(idx)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
