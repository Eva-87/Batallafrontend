import "./GameRoundResults.css";

export default function GameRoundResults({
  roundResult,
  players,
  isHost,
  onNext,
  onFinish
}) {
  return (
    <div className="gr-panel">
      <h2>Resultados de la ronda</h2>

      <p>
        Respuesta correcta:{" "}
        <strong>{["A", "B", "C", "D"][roundResult.correctIndex]}</strong>
      </p>

      <div className="gr-scores-list">
        {Object.entries(roundResult.scores)
          .sort(([, a], [, b]) => b - a)
          .map(([userId, score]) => {
            const player = players.find((p) => p.user.id === Number(userId));
            return (
              <div key={userId} className="gr-score-item">
                <span>{player ? player.user.username : "Jugador"}</span>
                <span>{score} pts</span>
              </div>
            );
          })}
      </div>

      {isHost && (
        <div className="gr-actions">
          <button onClick={onNext}>Siguiente pregunta</button>
          <button onClick={onFinish}>Terminar juego</button>
        </div>
      )}
    </div>
  );
}
