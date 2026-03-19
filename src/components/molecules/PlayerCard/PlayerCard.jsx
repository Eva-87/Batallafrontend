import "./PlayerCard.css";

export default function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <div className="player-avatar">
        {player.user.username.charAt(0).toUpperCase()}
      </div>
      <div className="player-name">{player.user.username}</div>
    </div>
  );
}
