import "./PlayerCard.css";

export default function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <div className="player-avatar">
        <img
          src={player.user.avatarUrl || "/default-avatar.png"}
          alt="avatar"
        />
      </div>
      <div className="player-name">{player.user.username}</div>
    </div>
  );
}


