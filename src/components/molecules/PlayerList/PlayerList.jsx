import PlayerCard from "../PlayerCard/PlayerCard";
import "./PlayerList.css";

export default function PlayerList({ players }) {
  return (
    <div className="player-list">
      {players.map((p) => (
        <PlayerCard key={p.id} player={p} />
      ))}
    </div>
  );
}
