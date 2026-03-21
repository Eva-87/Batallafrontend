import "./GameFinalRanking.css";

export default function GameFinalRanking({ ranking }) {
  if (!ranking || ranking.length === 0) {
    return <p>No hay resultados finales.</p>;
  }

  return (
    <div className="final-ranking-container">
      <h2>Resultados Finales</h2>

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
          {ranking.map(player => {
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
