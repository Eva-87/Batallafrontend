import "./GameFinalRanking.css";

export default function GameFinalRanking({ ranking }) {
  return (
    <div className="gr-panel">
      <h2>Clasificación final</h2>

      <ol className="gr-ranking-list">
        {ranking.map((r, i) => (
          <li key={r.userId}>
            #{i + 1} — {r.username} — {r.score} pts
          </li>
        ))}
      </ol>
    </div>
  );
}
