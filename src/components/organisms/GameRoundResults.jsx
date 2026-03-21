import "./GameRoundResults.css";

export default function GameRoundResults({
  roundResult,
  question,
  isHost,
  onNext,
  onFinish
}) {
  if (!roundResult || !question) return null;

  return (
    <div className="results-container">
      <h2>Resultados de la ronda</h2>

      <p>
        Respuesta correcta:{" "}
        <strong>{question.options[roundResult.correctIndex]}</strong>
      </p>

      {question.explanation && (
        <p className="explanation">
          Explicación: {question.explanation}
        </p>
      )}

      <h3>Puntajes:</h3>
      <ul>
        {Object.entries(roundResult.scores).map(([userId, score]) => (
          <li key={userId}>
            Usuario {userId}: {score} puntos
          </li>
        ))}
      </ul>

      {isHost && (
        <div className="host-controls">
          <button className="next-btn" onClick={onNext}>
            Siguiente pregunta
          </button>

          <button className="finish-btn" onClick={onFinish}>
            Terminar juego
          </button>
        </div>
      )}
    </div>
  );
}
