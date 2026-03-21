import "./GameQuestion.css";

export default function GameQuestion({
  question,
  timeLeft,
  selectedIndex,
  hasAnswered,
  onAnswer
}) {
  if (!question) return null;

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
