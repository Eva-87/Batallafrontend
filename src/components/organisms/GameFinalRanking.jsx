import { useEffect } from "react";
import "./GameFinalRanking.css";

export default function GameFinalRanking({ ranking }) {
  if (!ranking || ranking.length === 0) {
    return <p>No hay resultados finales.</p>;
  }

  // Ordenar por score (mayor primero)
  const sorted = [...ranking].sort((a, b) => b.score - a.score);

  const topScore = sorted[0].score;
  const tiedPlayers = sorted.filter(p => p.score === topScore);

  const isTie = tiedPlayers.length > 1;
  const winner = sorted[0];

  // 🔥 SUMAR VICTORIA AUTOMÁTICAMENTE
  useEffect(() => {
    if (!isTie && winner) {
      fetch(`http://localhost:8080/api/users/${winner.userId}/add-win`, {
        method: "PUT"
      });
    }
  }, [isTie, winner]);

  return (
    <div className="final-ranking-container">
      <h2>Resultados Finales</h2>

      {/* 🔥 Mensaje principal */}
      {isTie ? (
        <div className="tie-message">
          🤝 <strong>HAN EMPATADO:</strong> {tiedPlayers.map(p => p.username).join(" y ")}
        </div>
      ) : (
        <div className="winner-message">
          🏆 <strong>HA GANADO {winner.username.toUpperCase()}!!!</strong> 🏆
        </div>
      )}

      {/* 🔥 Tabla completa */}
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Puntos</th>
            <th>Aciertos</th>
            <th>Preguntas</th>
            <th>Porcentaje</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map(player => {
            const percent = Math.round(
              (player.correctAnswers / player.totalQuestions) * 100
            );

            return (
              <tr key={player.userId}>
                <td>{player.username}</td>
                <td>{player.score}</td>
                <td>{player.correctAnswers}</td>
                <td>{player.totalQuestions}</td>
                <td>{percent}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

